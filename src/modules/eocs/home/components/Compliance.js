import {Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {PBox} from "../../../shared/components/PBox";

export function Compliance(){
    return (
        <PBox>
            <Typography>
                <FormattedMessage id={'home.text.wait_for_verification'}/>
            </Typography>
        </PBox>
    );
}
