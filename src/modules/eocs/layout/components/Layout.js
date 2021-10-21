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
import {AppRouting} from "../../../../services/AppRouting";
import {useContext} from "react";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {CircularProgress} from "@mui/material";

export function Layout(props){

    const drawerWidth = 240;
    const fic = useContext(FetchInterceptorContext);

    return (

        <Box style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" style={{ zIndex: 1300}}>
                <Toolbar>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="h6" noWrap component="div">EOCS</Typography>
                        </Grid>

                        <Grid item>
                            <LangSwitch/>
                        </Grid>

                        <Grid item>
                            {fic.loading && <CircularProgress />}
                            {fic.error && !fic.loading && <Typography color={"error"}>{fic.error}</Typography>}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                style={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box style={{ overflow: 'auto' }}>
                    <SideNav/>
                </Box>
            </Drawer>

            <Box p={3} component="main" style={{ flexGrow: 1}}>
                <Toolbar />
                <AppRouting/>
            </Box>
        </Box>
    );
}
