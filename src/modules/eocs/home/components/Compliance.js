import {Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {SPaper} from "../../../shared/components/SPaper";
import {MessageWarning} from "../../../shared/components/MessageWarning";
import {TH1} from "../../../shared/components/TH1";

export function Compliance(){
    return (
        <MessageWarning>
                <FormattedMessage id={'home.text.wait_for_verification'}/>
        </MessageWarning>
    );
}
