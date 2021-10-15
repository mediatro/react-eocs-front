import {List, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList} from "@material-ui/core";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {Link, useLocation} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {routes} from "../../../AppRouting";

export function SideNav(props){

    const authc = useContext(AuthContext);
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
                return authc.manager.isVerified();
            }
            return authc.manager.getUser();
        }else if(route.conditions.authed === false){
            return !authc.manager.getUser();
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
