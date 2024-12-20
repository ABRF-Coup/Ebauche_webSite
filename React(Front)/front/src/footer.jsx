import React from 'react';
import {Typography, Link, Container} from '@mui/material';
import {Box, Grid} from '@mui/system';





function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link href="/" color="inherit">
                My Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const footers=[
    {
        title:'Company',
        description:['Team','History','Contact us','Locations'],
    },

    {
        title:'Features',
        description:['Cool stuff','Random feature','Team feature','Developer stuff','Another one'],
    },

    {
        title:'Resources',
        description:['Resource','Resource name','Another resource','Final resource'],
    },

    {
        title:'Legal',
        description:['Privacy policy','Terms of use'],
    },
];

function Footer() {
    return (
        <React.Fragment>
            <Container 
               
               maxWidth="lg" 
               component="footer"
               sx={(theme) => ({
                backgroundColor: '#f4f4f4',
                borderTop: `1px solid ${theme.palette.divider}`,
                mt: 8,
                pt: 3,
                pb: 3,
                width: '100%',
                
                [theme.breakpoints.up('sm')]: {
                    pt: 6,
                    pb: 6,
                   
                },
            })}
               >
                <Grid container spacing={4} justifyContent="space-evenly">
                    {footers.map((footer) =>(
                        <Grid item={footer.title.toString()} xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0.6, m: 0 }}>
                                {footer.description.map((truc) =>(
                                    <Box component="li" key={truc} sx={{ mb: 0.7 }}>
                                        <Link href="#" variant="subtitle1" color="text.secondary">
                                            {truc}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </React.Fragment>
              
    );
}


export default Footer;



