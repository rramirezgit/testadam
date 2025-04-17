"use client"

import type * as React from "react"
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
} from "@mui/material"
import { Icon } from "@iconify/react"

const Accordion = MuiAccordion

interface AccordionItemProps {
  value: string
  className?: string
  children?: React.ReactNode
}

const AccordionItem = ({ value, className, children, ...props }: AccordionItemProps) => {
  return (
    <MuiAccordion className={className} {...props}>
      {children}
    </MuiAccordion>
  )
}

interface AccordionTriggerProps {
  className?: string
  children?: React.ReactNode
}

const AccordionTrigger = ({ className, children, ...props }: AccordionTriggerProps) => {
  return (
    <MuiAccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />} className={className} {...props}>
      <Typography>{children}</Typography>
    </MuiAccordionSummary>
  )
}

interface AccordionContentProps {
  className?: string
  children?: React.ReactNode
}

const AccordionContent = ({ className, children, ...props }: AccordionContentProps) => {
  return (
    <MuiAccordionDetails className={className} {...props}>
      {children}
    </MuiAccordionDetails>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
