import { Client } from "@notionhq/client";
import { slugify } from "src/utils";
import React from "react";
import { notionApiTextToJsx } from "src/notionApiTextToJsx";
import Link from "next/link";

type Text = {
  content: string;
  link: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

type Tag = {
  id: string;
  name: string;
};

type Post = {
  title: string;
  tags: Tag[];
  paragraphs: Text[][];
};

const Post: React.FC<{ post: Post; page: any }> = ({ post, page }) => {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <h2>{post.title}</h2>
      Tags:
      <ul>
        {post.tags.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
      {post.paragraphs.map((p, i) => (
        <p key={i}>{p.map((x, i) => notionApiTextToJsx(x, String(i)))}</p>
      ))}
    </div>
  );
};

export const getStaticPaths = async () => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const data = await notion.databases.query({
    database_id: process.env.PAGE_ID,
  });

  const paths = [];

  const titles = data.results.map((x) => {
    return (x.properties.Name as any).title[0].plain_text;
  });

  titles.forEach((title) => {
    paths.push({
      params: {
        slug: slugify(title),
      },
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  // fetch details for recipe
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const data = await notion.databases.query({
    database_id: process.env.PAGE_ID,
  });

  const page = data.results.find((result) => {
    const title = (result.properties.Name as any).title[0].plain_text;
    const resultSlug = slugify(title);
    return resultSlug === slug;
  });

  const blocks = await notion.blocks.children.list({
    block_id: page.id,
  });

  const title = (page.properties.Name as any).title[0].plain_text;
  const paragraphs: Text[][] = [];

  blocks.results.forEach((block) => {
    if (block.type === "paragraph") {
      const x = [];
      block.paragraph.text.forEach((text) => {
        x.push({
          content: (text as any).text.content,
          link: (text as any).text.link?.url || null,
          annotations: text.annotations,
        });
      });
      paragraphs.push(x);
    }

    // if (block.type === "numbered_list_item") {
    //   method.push(block.numbered_list_item.text[0].plain_text);
    // }
  });
  const tags = (page.properties.Tags as any).multi_select.map(
    ({ name, id }) => {
      return { name, id };
    }
  );

  return {
    props: {
      page,
      post: {
        tags,
        title,
        paragraphs,
      },
    },
    revalidate: 10,
  };
};

export default Post;
