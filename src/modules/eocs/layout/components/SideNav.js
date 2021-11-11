import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {Link, useLocation} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import {routes} from "../../../../config/routing";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";
import {useNewUserFlow} from "../../home/services/NewUserFlow";
import {List, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList} from "@mui/material";

export function SideNav(props){

    const location = useLocation();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const pmc = useContext(PaymentManagerContext);
    const flow = useNewUserFlow();

    const isActive = (routeName) => {
        return location.pathname === routeName;
    }

    const isRouteAvailable = (route) => {
        if(route.menu === false) {
            return false;
        }

        if(!route.conditions) {
            return true;
        }

        if(route.conditions.authed === true){
            if(route.conditions.initiated === true) {
                return flow.isEverythingComplete();
            }
            if (route.conditions.verified === true) {
                return pmc.manager.isPaymentRequestAvailable();
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
                        <ListItemIcon>
                            {route.icon && <route.icon color={'primary'}/>}
                        </ListItemIcon>
                        <ListItemText><FormattedMessage id={route.message}/></ListItemText>
                    </ListItem>
            ))}
        </List>
    );
}
