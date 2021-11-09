import {Box} from "@mui/material";

export function ContainerSmall(props){

    return (
        <Box
            sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 'sm',
            }}
        >
            {props.children}
        </Box>
    );

}
