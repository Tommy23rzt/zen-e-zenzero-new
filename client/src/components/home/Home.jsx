import { Container, Grid } from '@mui/material';

//components
import Banner from '../banner/Banner';
import Categories from './Categories';
import Posts from './post/Posts';

const Home = () => {

    return (
        <>
            <Banner />
            <Container maxWidth="xl" sx={{ mt: { xs: 4, sm: 5, md: 6, lg: 8 }, mb: { xs: 4, sm: 5, md: 6, lg: 8 } }}>
                <Grid container>
                    <Grid
                        item
                        lg={2}
                        xs={12}
                        sm={12}
                        sx={{
                            '@media (min-width: 1920px)': {
                                position: 'relative',
                                left: 'calc(-1 * (100vw - 1536px) / 4)'
                            }
                        }}
                    >
                        <Categories />
                    </Grid>
                    <Grid container item xs={12} sm={12} lg={10}>
                        <Posts />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Home;