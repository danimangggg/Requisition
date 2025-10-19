import React, { useState, useEffect } from 'react';
import axios from 'axios';

// MUI Imports
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Card, 
    CardContent, 
    CircularProgress, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Alert,
    IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

// --- Configuration ---
const BASE_API_URL = 'http://localhost:3001/api/auth'; 

/**
 * Helper function to handle logout logic
 * @param {Function} setCurrentPage - function to set the current page state
 * @param {Function} setUser - function to set the user state
 */
const handleLogout = (setCurrentPage, setUser) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
};

// --- Page Components ---

/**
 * 1. Employee Dashboard (Placeholder)
 */
const EmployeeDashboard = ({ user, setCurrentPage, setUser }) => (
    <Container component="main" maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Card raised sx={{ p: 4 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Employee Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
                Welcome, {user.user_name} ({user.account_type})
            </Typography>
            <Box sx={{ my: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Typography>
                    This is your control panel for managing inventory and processing requisitions.
                </Typography>
            </Box>
            <Button 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />} 
                onClick={() => handleLogout(setCurrentPage, setUser)}
            >
                Logout
            </Button>
        </Card>
    </Container>
);

/**
 * 2. Customer Dashboard (Placeholder)
 */
const CustomerDashboard = ({ user, setCurrentPage, setUser }) => (
    <Container component="main" maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Card raised sx={{ p: 4 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Customer Requisition Portal
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
                Welcome, {user.user_name} (Facility: {user.facility || 'N/A'})
            </Typography>
            <Box sx={{ my: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Typography>
                    Here you can create new pharmaceutical requisitions and track their status.
                </Typography>
            </Box>
            <Button 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />} 
                onClick={() => handleLogout(setCurrentPage, setUser)}
            >
                Logout
            </Button>
        </Card>
    </Container>
);


/**
 * 3. Combined Login Page (MUI Styled)
 */
const LoginPage = ({ setCurrentPage, setUser }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('employee'); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Determine the correct API endpoint based on userType
            const endpoint = userType === 'employee' 
                ? `${BASE_API_URL}/employee/login` 
                : `${BASE_API_URL}/customer/login`;

            const response = await axios.post(endpoint, {
                user_name: userName,
                password: password,
            });

            // Successful Login
            const { token, user } = response.data;
            
            // Store token and user data
            const userData = { ...user, login_type: userType };
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            
            // Redirect based on the selected user type
            if (userType === 'employee') {
                setCurrentPage('employee_dashboard'); 
            } else {
                setCurrentPage('customer_dashboard'); 
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || `Login failed for ${userType}. Please check your credentials.`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card raised sx={{ 
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                borderRadius: 2,
                boxShadow: 8
            }}>
                <Box
                    sx={{
                        m: 1,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1.5,
                        color: 'white',
                        boxShadow: 3
                    }}
                >
                    <LockOutlinedIcon fontSize="large" />
                </Box>
                <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Requisition System Login
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    
                    {/* User Type Dropdown */}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="user-type-label">Login As</InputLabel>
                        <Select
                            labelId="user-type-label"
                            id="userType"
                            value={userType}
                            label="Login As"
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <MenuItem value="employee">Employee</MenuItem>
                            <MenuItem value="customer">Customer</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Username/ID Input */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label={userType === 'employee' ? 'Username' : 'Customer ID'}
                        name="userName"
                        autoComplete="username"
                        autoFocus
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    {/* Password Input */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {/* Submit Button */}
                    <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ py: 1.5, fontWeight: 'bold' }}
                        >
                            Sign In
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'primary.dark',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Card>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
                © {new Date().getFullYear()} Pharmaceutical Requisition System
            </Typography>
        </Container>
    );
};


/**
 * 4. Main App Component and State-Based Router
 */
const App = () => {
    // State to manage the current view (simulates routing)
    const [currentPage, setCurrentPage] = useState('login');
    // State to hold authenticated user information
    const [user, setUser] = useState(null);

    // Effect to check local storage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                
                // Set the page based on the stored user's login type
                if (userData.login_type === 'employee') {
                    setCurrentPage('employee_dashboard');
                } else if (userData.login_type === 'customer') {
                    setCurrentPage('customer_dashboard');
                } else {
                    // Fallback to login if user data is incomplete
                    setCurrentPage('login');
                }
            } catch (e) {
                // If parsing fails, force login
                handleLogout(setCurrentPage, setUser);
            }
        }
    }, []);

    const renderPage = () => {
        if (currentPage === 'login') {
            return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
        }
        if (currentPage === 'employee_dashboard' && user) {
            return <EmployeeDashboard user={user} setCurrentPage={setCurrentPage} setUser={setUser} />;
        }
        if (currentPage === 'customer_dashboard' && user) {
            return <CustomerDashboard user={user} setCurrentPage={setCurrentPage} setUser={setUser} />;
        }
        // Fallback if not authenticated or state is bad
        return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
    };

    return (
        // The main container for the application
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            {renderPage()}
        </Box>
    );
};

export default App;
