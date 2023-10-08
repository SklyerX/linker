import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface GithubAccessTokenEmailProps {
  username?: string;
  downloadURL: string;
}

export const ExportedAccountDetails = ({
  username = "Linker User",
  downloadURL,
}: GithubAccessTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>Your account data was successfully exported.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>
          <strong>@{username}</strong>, your account data has been successfully
          exported.
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey <strong>{username}</strong>!
          </Text>
          <Text style={text}>
            We've exported all your account information. Please note that this
            link will be invalid in exactly one day at 11:59 P.M if you fail to
            download it by then you must submit another request once that
            waiting period is over.
          </Text>

          <Link href={downloadURL} style={button} download={true}>
            View your token
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ExportedAccountDetails;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "0.75em 1.5em",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
