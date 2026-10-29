import React, { useState, useEffect, useContext } from 'react';

import { TextField, Box, Button, Typography, styled, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { useColorMode } from '../../context/ColorModeContext';

const Component = styled(Box)(({ theme }) => ({
    width: 400,
    maxWidth: 'calc(100% - 32px)',
    margin: 'auto',
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 24px rgba(0, 0, 0, 0.6)'
        : '5px 2px 5px 2px rgba(0, 0, 0, 0.6)'
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 1201,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    }
}));

const Image = styled('img')({
    width: 100,
    display: 'flex',
    margin: 'auto',
    padding: '50px 0 0'
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    height: 48px;
    border-radius: 2px;
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: ${({ theme }) => theme.palette.mode === 'dark' ? theme.palette.action.hover : '#fff'};
    color: ${({ theme }) => theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main};
    height: 48px;
    border-radius: 2px;
    border: ${({ theme }) => theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none'};
    box-shadow: ${({ theme }) => theme.palette.mode === 'dark' ? 'none' : '0 2px 4px 0 rgba(0, 0, 0, 0.2)'};
`;

const Text = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: 12
}));

const Error = styled(Typography)(({ theme }) => ({
    fontSize: 10,
    color: theme.palette.error.main,
    lineHeight: 0,
    marginTop: 10,
    fontWeight: 600
}));

const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [account, toggleAccount] = useState('login');

    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);
    const { mode, toggleColorMode } = useColorMode();

    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

    useEffect(() => {
        showError(false);
    }, [login])

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const loginUser = async () => {
        let response = await API.userLogin(login);
        if (response.isSuccess) {
            showError('');

            sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
            sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
            setAccount({ name: response.data.name, username: response.data.username });
            
            isUserAuthenticated(true)
            setLogin(loginInitialValues);
            navigate('/');
        } else {
            showError('Something went wrong! please try again later');
        }
    }

    const signupUser = async () => {
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
            showError('');
            setSignup(signupInitialValues);
            toggleAccount('login');
        } else {
            showError('Something went wrong! please try again later');
        }
    }

    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }

    return (
        <Component>
            <ThemeToggle
                onClick={toggleColorMode}
                aria-label={mode === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
            >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </ThemeToggle>
            <Box>
                <Image src={imageURL} alt="blog" />
                {
                    account === 'login' ?
                        <Wrapper>
                            <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Enter Username' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); loginUser(); } }} />
                            <TextField variant="standard" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' type='password' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); loginUser(); } }} />

                            {error && <Error>{error}</Error>}

                            <LoginButton variant="contained" onClick={() => loginUser()} >Login</LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SignupButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                        </Wrapper> :
                        <Wrapper>
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='name' label='Enter Name' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); signupUser(); } }} />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='username' label='Enter Username' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); signupUser(); } }} />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='password' label='Enter Password' type='password' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); signupUser(); } }} />

                            <SignupButton onClick={() => signupUser()} >Signup</SignupButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <LoginButton variant="contained" onClick={() => toggleSignup()}>Already have an account</LoginButton>
                        </Wrapper>
                }
            </Box>
        </Component>
    )
}

export default Login;