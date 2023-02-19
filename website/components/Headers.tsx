import { useState } from "react";
import {
    createStyles,
    Container,
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    Tabs,
    Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown,
    IconCircleDotted,
} from "@tabler/icons";
// import { MantineLogo } from '@mantine/ds';

import { useRouter } from "next/router";
import { HackedText } from "@/components/HackedText";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { tabs } from "../constants/";

const useStyles = createStyles((theme) => ({
    title: {
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
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
        // marginBottom: 120,
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

interface HeaderTabsProps {
    tabs: { name: string; href: string }[];
}

export function HeaderTabsColored() {
    const { classes, theme, cx } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const items = tabs.map((tab) => (
        <Tabs.Tab value={tab.name} key={tab.name}>
            {tab.name}
        </Tabs.Tab>
    ));
    const router = useRouter();
    const titleClick = () => {
        router.push("/");
    };

    function capitalizeFirstLetter(string: string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
    }

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection}>
                <Group position="apart">
                    {/* <MantineLogo size={28} inverted /> */}
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
                                "&:hover": {
                                    // backgroundColor: "white",
                                    // color: "black",
                                },
                            }}
                            color={theme.white}
                        >
                            <HackedText
                                // style={{
                                //     pointerEvents: "all",
                                // }}
                                value="The Dao"
                                // useDefaultStyle={false}
                                useDefaultStyle={true}
                            />
                        </Text>
                        {/* <IconCircleDotted color={theme.white} size={35} /> */}
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
                                <Menu.Item
                                    key={tab.name}
                                    component="a"
                                    href={tab.href}
                                >
                                    {tab.name}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>

                    {/* <Menu
                        width={260}
                        position="bottom-end"
                        transition="pop-top-right"
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                    >
                        <Menu.Target>
                            <UnstyledButton
                                className={cx(classes.user, {
                                    [classes.userActive]: userMenuOpened,
                                })}
                            >
                                <Group spacing={7}>
                                    <Avatar
                                        src={user.image}
                                        alt={user.name}
                                        radius="xl"
                                        size={20}
                                    />
                                    <Text
                                        weight={500}
                                        size="sm"
                                        sx={{
                                            lineHeight: 1,
                                            color: theme.white,
                                        }}
                                        mr={3}
                                    >
                                        {user.name}
                                    </Text>
                                    <IconChevronDown size={12} stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                icon={
                                    <IconHeart
                                        size={14}
                                        stroke={1.5}
                                        color={theme.colors.red[6]}
                                    />
                                }
                            >
                                Liked posts
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <IconStar
                                        size={14}
                                        stroke={1.5}
                                        color={theme.colors.yellow[6]}
                                    />
                                }
                            >
                                Saved posts
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <IconMessage
                                        size={14}
                                        stroke={1.5}
                                        color={theme.colors.blue[6]}
                                    />
                                }
                            >
                                Your comments
                            </Menu.Item>

                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item
                                icon={<IconSettings size={14} stroke={1.5} />}
                            >
                                Account settings
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <IconSwitchHorizontal
                                        size={14}
                                        stroke={1.5}
                                    />
                                }
                            >
                                Change account
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconLogout size={14} stroke={1.5} />}
                            >
                                Logout
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                                icon={
                                    <IconPlayerPause size={14} stroke={1.5} />
                                }
                            >
                                Pause subscription
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                icon={<IconTrash size={14} stroke={1.5} />}
                            >
                                Delete account
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu> */}
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
                            (tab) =>
                                tab.href ===
                                router.pathname.slice(1).split("/")[0]
                        )?.name
                    }
                    onTabChange={(value) =>
                        router.push(
                            tabs.find((tab) => tab.name === value)?.href || "/"
                        )
                    }
                >
                    <Tabs.List>{items}</Tabs.List>
                </Tabs>
            </Container>
        </div>
    );
}
