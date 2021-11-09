import {LangSwitch} from "./LangSwitch";
import {SideNav} from "./SideNav";
import {AppRouting} from "../../../../services/AppRouting";
import {useContext, useState} from "react";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {
    AppBar,
    Box,
    Button,
    Container, CssBaseline,
    Divider,
    Drawer, Grid,
    List,
    ListItem,
    ListItemIcon, ListItemText, ToggleButton, ToggleButtonGroup,
    Toolbar,
    Typography,
    CircularProgress, Link, IconButton, Badge
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Support: '}
            <Link color="inherit" href="mailto:info@eocse.com">
                info@eocse.com
            </Link>
        </Typography>
    );
}

const drawerWidth = 300;

const SAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const SDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

export function Layout(props){

    const fic = useContext(FetchInterceptorContext);

    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                <SAppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Grid container maxWidth={'lg'} alignItems={'center'}>
                            <Grid item xs>
                                <Typography
                                    component="h1"
                                    variant="h6"
                                    color="inherit"
                                    noWrap
                                    sx={{ flexGrow: 1 }}
                                >
                                    EOCS
                                </Typography>
                            </Grid>

                            <Grid item>
                                {fic.loading && <CircularProgress />}
                                {fic.error && !fic.loading && <Typography color={"error"}>{fic.error}</Typography>}
                            </Grid>

                            <Grid item>
                                <LangSwitch/>
                            </Grid>
                        </Grid>

                    </Toolbar>
                </SAppBar>

                <SDrawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>

                    <Divider />

                    <SideNav/>
                </SDrawer>

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',

                    }}
                >
                    <Toolbar />

                    <Container maxWidth="md" sx={{
                        mt: 4,
                        mb: 4,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <AppRouting/>
                    </Container>

                    <Box
                        component="footer"
                        sx={{
                            py: 3,
                            px: 2,
                            mt: 'auto',
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[200]
                                    : theme.palette.grey[800],
                        }}
                    >
                        <Container maxWidth="sm">
                            <Copyright />
                        </Container>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
