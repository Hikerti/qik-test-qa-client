import { FC, ReactNode } from "react";

export const Page: FC<Page.Props> = ({ children }) => {
  return <div></div>;
};

export namespace Page {
  export type Props = {
    children: ReactNode;
    header: ReactNode
  };
}

