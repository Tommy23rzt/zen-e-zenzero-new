import { Container, Grid, Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const FooterLink = styled(Link)`
    color: #fff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
    }
`;

const Footer = () => {
    
    return (

        <Box
            px={{ xs: 3, sm: 10 }}
            py={{ xs: 5, sm: 10 }}
            bgcolor="#9c27b0"
            color="white"
            marginTop="50px"
            display="flex"
            padding-bottom="20px"
            >
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                    <FooterLink to="/">
                        <Box borderBottom={1}>Home</Box>
                        </FooterLink>
                        <Box>
                            <FooterLink to="/login">
                                Logout
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/privacy">
                                Privacy
                            </FooterLink>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box borderBottom={1}>Messages</Box>
                        <Box>
                            <FooterLink to="/contact">
                                Contact
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/about">
                                About
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/">
                                Privacy
                            </FooterLink>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box borderBottom={1}>Categorie</Box>
                        <Box>
                            <FooterLink to="/">
                                All Categories
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/?category=Psico-Emotivit%C3%A0">
                                Psico-Emotività
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/?category=Celebrazioni">
                                Celebrazioni
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/?category=Simbologia">
                                Simbologia
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/?category=Spazio-Ascolto">
                                Spazio-Ascolto
                            </FooterLink>
                        </Box>
                        <Box>
                            <FooterLink to="/?category=Altro">
                                Altro
                            </FooterLink>
                        </Box>
                    </Grid>
                </Grid>
                <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
                    Proudly Powered RZT &reg; {new Date().getFullYear()}
                </Box>
            </Container>
        </Box>
    )
}

export default Footer;
