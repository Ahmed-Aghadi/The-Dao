import { AppContainer } from "@/components/AppContainer";
import { HoverCards } from "@/components/HoverCards";
import {
  Badge,
  Center,
  Container,
  createStyles,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBoxMultiple, IconSquarePlus, IconZoomMoney } from "@tabler/icons";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
  },
}));

const tiles = [
  {
    title: "Create DAO",
    icon: <IconSquarePlus size={100} />,
    href: "/create-dao",
  },
  {
    title: "Explore DAOs",
    icon: <IconBoxMultiple size={100} />,
    href: "/daos",
  },
  {
    title: "Explore Bounties",
    icon: <IconZoomMoney size={100} />,
    href: "/bounties",
  },
];

export default function Home() {
  const { classes, theme } = useStyles();
  const router = useRouter();
  const hrefs = tiles.map((tile) => tile.href);
  const divs = tiles.map((tile) => {
    return (
      <div
        key={tile.title}
        style={{
          height: "100%",
        }}
      >
        <Stack
          align="center"
          justify="center"
          style={{
            height: "100%",
          }}
        >
          {tile.icon}
          <h3>{tile.title}</h3>
        </Stack>
      </div>
    );
  });
  return (
    <AppContainer>
      <div
        style={{
          backgroundColor: "rgb(20, 20, 20)",
          height: "100%",
          width: "100%",
        }}
      >
        <Container size="lg" py="xl">
          <Group position="center">
            <Badge variant="filled" size="lg">
              HOME PAGE
            </Badge>
          </Group>

          <Title order={2} className={classes.title} align="center" mt="sm">
            Explore the app
          </Title>

          <Text
            color="dimmed"
            className={classes.description}
            align="center"
            mt="md"
          >
            Create DAOs, vote on proposals, participate in bounties, and more.
          </Text>

          <HoverCards divs={divs} hrefs={hrefs} />
        </Container>
      </div>
    </AppContainer>
  );
}
