import type {ReactNode} from "react";

export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="en"><body style={{margin:0,fontFamily:"Arial, sans-serif",background:"#f5f7fa",color:"#101828"}}>{children}</body></html>;
}
