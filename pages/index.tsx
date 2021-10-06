import React from "react";
import Link from "next/link";
import Head from "next/head";
import Nav from "../components/Nav";
import { styled } from "$s";
import { Client } from "@notionhq/client";

const Container = styled("div", {
  maxWidth: 1440,
  padding: 16,
});

const Home = ({ titlesAndSlugs, data }) => {
  console.log(data);
  return (
    <Container>
      <Head>
        <title>fyrkant.net</title>
      </Head>

      <Nav />
      <ul>
        {titlesAndSlugs.map(({ title, slug }) => (
          <li key={title}>
            <Link href={`/post/${slug}`}>
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

  const titlesAndSlugs = data.results.map((x) => {
    const title = (x.properties.Name as any).title[0].plain_text;
    const slug = (x.properties.Slug as any).url;

    return { title, slug };
  });

  return {
    props: { titlesAndSlugs, data },
    revalidate: 10,
  };
};

export default Home;
