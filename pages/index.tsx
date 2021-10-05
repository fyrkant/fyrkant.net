import React from "react";
import Link from "next/link";
import Head from "next/head";
import Nav from "../components/Nav";
import { styled } from "$s";
import { Client } from "@notionhq/client";
import { slugify } from "src/utils";

const Container = styled("div", {
  maxWidth: 1440,
  padding: 16,
});

const Home = ({ titles, data }) => {
  return (
    <Container>
      <Head>
        <title>fyrkant.net</title>
      </Head>

      <Nav />
      <ul>
        {titles.map((title) => (
          <li key={title}>
            <Link href={`/post/${slugify(title)}`}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export const getStaticProps = async () => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const data = await notion.databases.query({
    database_id: process.env.PAGE_ID,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
  });

  const titles = data.results.map((x) => {
    return (x.properties.Name as any).title[0].plain_text;
  });

  return {
    props: { titles, data },
    revalidate: 10,
  };
};

export default Home;
