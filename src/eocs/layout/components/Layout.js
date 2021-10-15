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
    Typography
} from "@material-ui/core";
import {LangSwitch} from "./LangSwitch";
import {SideNav} from "./SideNav";
import {AppRouting} from "../../../AppRouting";

export function Layout(props){

    const drawerWidth = 240;

    return (<>
        <CssBaseline />
        <Container>
            <AppBar position="fixed"
                    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="h6" noWrap component="div">
                                EOCS
                            </Typography>
                        </Grid>

                        <Grid item>
                            <LangSwitch/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
            >
                <Toolbar />
                <Divider />

                <SideNav/>

                <Divider />
            </Drawer>

            <Box component="main"
                 sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >

                <Toolbar />
                <AppRouting/>

            </Box>
        </Container>
    </>);
}
