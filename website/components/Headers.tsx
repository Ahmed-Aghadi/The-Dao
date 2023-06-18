import {
  createStyles,
  Container,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useRouter } from "next/router";
import { HackedText } from "@/components/HackedText";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { tabs } from "../constants/";

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },

  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    borderBottom: `1px solid ${
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.white,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background!,
        0.1
      ),
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    color: theme.white,
    backgroundColor: "transparent",
    borderColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background!,
        0.1
      ),
    },

    "&[data-active]": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background!,
        0.1
      ),
      borderColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
    },
  },
}));

export function HeaderTabsColored() {
  const { classes, theme } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name}>
      {tab.name}
    </Tabs.Tab>
  ));
  const router = useRouter();
  const titleClick = () => {
    router.push("/");
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              titleClick();
            }}
          >
            <Text
              size={25}
              weight={700}
              sx={{
                marginRight: "5px",
                "&:hover": {},
              }}
              color={theme.white}
            >
              <HackedText value="The Dao" useDefaultStyle={true} />
            </Text>
          </div>

          <ConnectButton />

          <Menu>
            <Menu.Target>
              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
                color={theme.white}
              />
            </Menu.Target>

            <Menu.Dropdown>
              {tabs.map((tab) => (
                <Menu.Item key={tab.name} component="a" href={tab.href}>
                  {tab.name}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container>
        <Tabs
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
          value={
            tabs.find(
              (tab) => tab.href === router.pathname.slice(1).split("/")[0]
            )?.name
          }
          onTabChange={(value) =>
            router.push(tabs.find((tab) => tab.name === value)?.href || "/")
          }
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
