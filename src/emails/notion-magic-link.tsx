import { Img, Body, Head, Html, Link, Text, Heading, Preview, Container } from "@react-email/components"

export interface NotionMagicLinkEmailProps {
  loginCode?: string
  heading?: string
  linkText?: string
  codeText?: string
  footerText?: string
  hintText?: string
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""

export const NotionMagicLinkEmail = ({
  loginCode = "sparo-ndigo-amurt-secan",
  heading = "Login",
  linkText = "Click here to log in with this magic link",
  codeText = "Or, copy and paste this temporary login code:",
  footerText = "If you didn't try to login, you can safely ignore this email.",
  hintText = "Hint: You can set a permanent password in Settings & members → My account.",
}: NotionMagicLinkEmailProps) => (
  <Html>
    <Head>
      <Preview>Log in with this magic link</Preview>
    </Head>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{heading}</Heading>
        <Link
          href="https://notion.so"
          target="_blank"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
          {linkText}
        </Link>
        <Text style={{ ...text, marginBottom: "14px" }}>{codeText}</Text>
        <code style={code}>{loginCode}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          {footerText}
        </Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "12px",
            marginBottom: "38px",
          }}
        >
          {hintText}
        </Text>
        <Img src={`${baseUrl}/static/notion-logo.png`} width="32" height="32" alt="Notion's Logo" />
        <Text style={footer}>
          <Link href="https://notion.so" target="_blank" style={{ ...link, color: "#898989" }}>
            Notion.so
          </Link>
          , the all-in-one-workspace
          <br />
          for your notes, tasks, wikis, and databases.
        </Text>
      </Container>
    </Body>
  </Html>
)

NotionMagicLinkEmail.PreviewProps = {
  loginCode: "sparo-ndigo-amurt-secan",
} as NotionMagicLinkEmailProps

export default NotionMagicLinkEmail

const main = {
  backgroundColor: "#ffffff",
}

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
}

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
}

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
}

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
}

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
}

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
}
