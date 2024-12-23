import type { Metadata } from "next";
// import localFont from "next/font/local";
import {Inter} from "next/font/google";
import "./globals.css";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'
import { Toaster } from "@/components/ui/toaster"
// import { title } from "process";
import { ClerkProvider } from "@clerk/nextjs";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
// )
const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title:"YOOM",
  description:"Video calling app",
  icons:{
    icon:'/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children:React.ReactNode;
}>){
return(
  <html lang="en">
    <ClerkProvider appearance={{
      layout:{
        logoImageUrl:'/icons/yoom-logo.svg',
        socialButtonsVariant:'iconButton',
      },
      variables:{
      colorText:'#fff',
      colorPrimary:'#0e78f9',
      colorBackground:'#1c1f2e',
      colorInputBackground:'#252a41',
      colorInputText:'#fff',
    }}}>
    <body className={`${inter.className} bg-dark-2`}>{children}
    <Toaster/>
    </body>
    </ClerkProvider>
  </html>
);
}
  