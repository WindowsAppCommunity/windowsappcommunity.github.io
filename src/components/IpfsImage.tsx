
import { IImageProps, Image } from "@fluentui/react";
import type { CID } from "multiformats/cid";
import React from "react";
import { Fs, InitAsync } from "../common/services/helia";

export interface IIpfsImageProps extends IImageProps {
    cid: CID;
}

export const IpfsImage = (props: IIpfsImageProps) => {
    const [src, setSrc] = React.useState<string>();

    React.useEffect(() => {
        const fetchImage = async () => {
            await InitAsync();

            if (!Fs)
                return;

            const chunks : Uint8Array[] = [];
            
            for await (const chunk of Fs.cat(props.cid)) {
                console.log(`Image ${props.cid} chunk ${chunks.length} loaded with ${chunk.length} bytes`)
                chunks.push(chunk);
            }

            const blob = new Blob(chunks, { type: 'image/jpeg' })
            setSrc(URL.createObjectURL(blob));
        };

        fetchImage();
    }, [props.cid]);

    return <Image {...props} src={src} />;
}