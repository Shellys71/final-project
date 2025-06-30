import React, { Fragment } from "react";

import MainNavigation from "./MainNavigation";

const Layout: React.FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
