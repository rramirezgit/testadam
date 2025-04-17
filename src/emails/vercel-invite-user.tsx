import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

export interface VercelInviteUserEmailProps {
  username?: string
  userImage?: string
  invitedByUsername?: string
  invitedByEmail?: string
  teamName?: string
  teamImage?: string
  inviteLink?: string
  inviteFromIp?: string
  inviteFromLocation?: string
  heading?: string
  greeting?: string
  inviteText?: string
  buttonText?: string
  footerText?: string
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""

export const VercelInviteUserEmail = ({
  username = "alanturing",
  userImage = `${baseUrl}/static/vercel-user.png`,
  invitedByUsername = "Alan",
  invitedByEmail = "alan.turing@example.com",
  teamName = "Enigma",
  teamImage = `${baseUrl}/static/vercel-team.png`,
  inviteLink = "https://vercel.com/teams/invite/foo",
  inviteFromIp = "204.13.186.218",
  inviteFromLocation = "São Paulo, Brazil",
  heading,
  greeting,
  inviteText,
  buttonText = "Join the team",
  footerText,
}: VercelInviteUserEmailProps) => {
  const previewText = `Join ${invitedByUsername} on Vercel`

  // Usar valores por defecto si no se proporcionan
  const finalHeading = heading || `Join ${teamName} on Vercel`
  const finalGreeting = greeting || `Hello ${username},`
  const finalInviteText =
    inviteText || `${invitedByUsername} (${invitedByEmail}) has invited you to the ${teamName} team on Vercel.`
  const finalFooterText =
    footerText ||
    `This invitation was intended for ${username}. This invite was sent from ${inviteFromIp} located in ${inviteFromLocation}. If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.`

  return (
    <Html>
      <Head>
        <Preview>{previewText}</Preview>
      </Head>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {finalHeading}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">{finalGreeting}</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {finalInviteText.includes(invitedByEmail) ? (
                <>
                  <strong>{invitedByUsername}</strong> (
                  <Link href={`mailto:${invitedByEmail}`} className="text-blue-600 no-underline">
                    {invitedByEmail}
                  </Link>
                  ) has invited you to the <strong>{teamName}</strong> team on <strong>Vercel</strong>.
                </>
              ) : (
                finalInviteText
              )}
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img className="rounded-full" src={userImage} width="64" height="64" />
                </Column>
                <Column align="center">
                  <Img src={`${baseUrl}/static/vercel-arrow.png`} width="12" height="9" alt="invited you to" />
                </Column>
                <Column align="left">
                  <Img className="rounded-full" src={teamImage} width="64" height="64" />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                {buttonText}
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">{finalFooterText}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

VercelInviteUserEmail.PreviewProps = {
  username: "alanturing",
  userImage: `${baseUrl}/static/vercel-user.png`,
  invitedByUsername: "Alan",
  invitedByEmail: "alan.turing@example.com",
  teamName: "Enigma",
  teamImage: `${baseUrl}/static/vercel-team.png`,
  inviteLink: "https://vercel.com/teams/invite/foo",
  inviteFromIp: "204.13.186.218",
  inviteFromLocation: "São Paulo, Brazil",
} as VercelInviteUserEmailProps

export default VercelInviteUserEmail
