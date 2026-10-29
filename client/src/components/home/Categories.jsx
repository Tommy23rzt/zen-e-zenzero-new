import { Box, Button, Typography, alpha, styled } from '@mui/material';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link, useSearchParams } from 'react-router-dom';

import { categories } from '../../constants/data';

const CARD_FONT = "'Cinzel', 'Times New Roman', serif";

const Panel = styled(Box)(({ theme }) => {
    const isDark = theme.palette.mode === 'dark';

    return {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: 20,
        borderRadius: 24,
        border: '1px solid',
        borderColor: isDark
            ? alpha(theme.palette.common.white, 0.08)
            : alpha(theme.palette.divider, 0.9),
        backgroundColor: theme.palette.background.paper,
        backgroundImage: `radial-gradient(circle at 100% 0%, ${alpha(theme.palette.primary.main, isDark ? 0.16 : 0.07)} 0%, transparent 45%)`,
        boxShadow: isDark
            ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 18px 40px -24px rgba(0, 0, 0, 0.9)'
            : '0 1px 2px rgba(16, 24, 40, 0.05), 0 16px 36px -20px rgba(16, 24, 40, 0.18)'
    };
});

const Header = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 10
});

const IconBadge = styled(Box)(({ theme }) => ({
    width: 36,
    height: 36,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.09),
    color: theme.palette.primary.main,
    flexShrink: 0
}));

const Title = styled(Typography)(({ theme }) => ({
    fontFamily: CARD_FONT,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.palette.text.primary
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    fontSize: 12,
    color: theme.palette.text.secondary,
    letterSpacing: '0.02em'
}));

const CreateButton = styled(Button)(({ theme }) => ({
    width: '100%',
    minHeight: 46,
    borderRadius: 14,
    fontFamily: CARD_FONT,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'none',
    color: theme.palette.primary.contrastText,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: `0 10px 24px -14px ${alpha(theme.palette.primary.main, 0.9)}`,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        transform: 'translateY(-1px)',
        boxShadow: `0 14px 28px -14px ${alpha(theme.palette.primary.main, 0.95)}`
    },
    '&:active': {
        transform: 'translateY(0)'
    },
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
        minWidth: 200,
        alignSelf: 'flex-start'
    },
    [theme.breakpoints.up('lg')]: {
        width: '100%',
        minWidth: 0,
        alignSelf: 'stretch'
    },
    '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': {
            transform: 'none'
        }
    }
}));

const Divider = styled(Box)(({ theme }) => ({
    height: 1,
    backgroundColor: alpha(theme.palette.divider, 0.8)
}));

const CategoryList = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 4,
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '1fr'
    }
}));

const CategoryItem = styled(Link, { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    padding: '10px 10px',
    borderRadius: 12,
    border: '1px solid',
    borderColor: active ? alpha(theme.palette.primary.main, 0.28) : 'transparent',
    backgroundColor: active
        ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
        : 'transparent',
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    textDecoration: 'none',
    fontFamily: CARD_FONT,
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.07),
        borderColor: alpha(theme.palette.primary.main, 0.22),
        color: theme.palette.primary.main,
        '& .category-chevron': {
            opacity: 1,
            transform: 'translateX(2px)'
        }
    },
    '&:focus-visible': {
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.7)}`,
        outlineOffset: 2
    },
    '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover .category-chevron': {
            transform: 'none'
        }
    }
}));

const Dot = styled(Box, { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.35),
    boxShadow: active ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
}));

const Label = styled(Typography)({
    minWidth: 0,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 1.35,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere'
});

const Chevron = styled(ChevronRightRoundedIcon, { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
    marginLeft: 'auto',
    fontSize: 17,
    color: theme.palette.primary.main,
    opacity: active ? 1 : 0,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    flexShrink: 0
}));

const Categories = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    return (
        <Panel component="aside" aria-label="Categorie">
            <Header>
                <IconBadge>
                    <ExploreOutlinedIcon sx={{ fontSize: 20 }} />
                </IconBadge>
                <Box>
                    <Title component="h2">Categorie</Title>
                </Box>
            </Header>

            <CreateButton
                component={Link}
                to={category && category !== 'undefined' ? `/create?category=${encodeURIComponent(category)}` : '/create'}
                startIcon={<AddRoundedIcon />}
            >
                Create Blog
            </CreateButton>

            <Divider />

            <CategoryList component="nav" aria-label="Filtra per categoria">
                <CategoryItem to="/" active={!category} aria-current={!category ? 'page' : undefined}>
                    <Dot active={!category} aria-hidden="true" />
                    <Label component="span">All Categories</Label>
                    <Chevron className="category-chevron" active={!category} />
                </CategoryItem>
                {categories.map((item) => {
                    const active = category === item.type;

                    return (
                        <CategoryItem
                            key={item.id}
                            to={`/?category=${encodeURIComponent(item.type)}`}
                            active={active}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Dot active={active} aria-hidden="true" />
                            <Label component="span">{item.type}</Label>
                            <Chevron className="category-chevron" active={active} />
                        </CategoryItem>
                    );
                })}
            </CategoryList>
        </Panel>
    );
};

export default Categories;
