import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import NextApp from "next/app";
import Head from "next/head";
import type { ColorScheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import AppShellDemo from "../../components/Shell";
import { Notifications } from "@mantine/notifications";

export function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    pageProps.colorScheme
  );
  console.log(pageProps);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };
  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications>
            <ModalsProvider labels={{ confirm: "Submit", cancel: "Cancel" }}>
              <AppShellDemo>
                <Component {...pageProps} />
              </AppShellDemo>
            </ModalsProvider>
          </Notifications>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  appProps.pageProps = {
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
  return appProps;
};
export default trpc.withTRPC(App);
