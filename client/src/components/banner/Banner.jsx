
import { styled, Box, Typography } from '@mui/material';

const BANNER_URL = 'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=1600';

const Image = styled(Box)`
    width: 100%;
    background-image: url(${BANNER_URL});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #171717;
    height: 50vh;
    min-height: 320px;
    max-height: 640px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Heading = styled(Typography)`
    font-size: clamp(40px, 6vw, 110px);
    color: #FFFFFF;
    line-height: 1;
    text-align: center;
`;

const SubHeading = styled(Typography)`
    font-size: clamp(16px, 1.5vw, 28px);
    background: #FFFFFF;
    color: #171717;
    text-align: center;
`;

const Banner = () => {
    
    return (
        <Image>
            <Heading>BLOG</Heading>
            <SubHeading>Zen -&- Zenzero</SubHeading>
        </Image>
    )
}

export default Banner;