import LanguageIcon from "@mui/icons-material/Language";
import {Box, Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useContext} from "react";
import {I18NContext} from "../../../shared/services/I18NProvider";

export function LangSwitch(){

    const i18nc = useContext(I18NContext);

    return (
        <Grid container alignItems={"center"}>
            <LanguageIcon sx={{mr: 2}}/>

            <ToggleButtonGroup exclusive
                               value={i18nc.locale}
                               color={"secondary"}
                               onChange={(e, v)=> v && i18nc.setLocale(v)}
            >
                <ToggleButton value="ru">RU</ToggleButton>
                <ToggleButton value="en">EN</ToggleButton>
            </ToggleButtonGroup>
        </Grid>
    );
}
