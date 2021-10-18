import {List, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList} from "@material-ui/core";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {Link, useLocation} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {routes} from "../../../../services/AppRouting";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";

export function SideNav(props){

    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const location = useLocation();

    const isActive = (routeName) => {
        return location.pathname == routeName;
    }

    const isRouteAvailable = (route) => {
        if(!route.conditions) {
            return true;
        }

        if(route.conditions.authed === true){
            if(route.conditions.verified === true) {
                return umc.manager.isUserVerified();
            }
            return authc.manager.checkAuth();
        }else if(route.conditions.authed === false){
            return !authc.manager.checkAuth();
        }
    }

    return(
        <List>
            {routes.map((route) => (
                (isRouteAvailable(route)) &&
                    <ListItem button
                              component={Link} to={route.path}
                              selected={isActive(route.path)}
                    >
                        <ListItemIcon></ListItemIcon>
                        <ListItemText><FormattedMessage id={route.message}/></ListItemText>
                    </ListItem>
            ))}
        </List>
    );
}
