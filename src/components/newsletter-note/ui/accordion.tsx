"use client"

import type * as React from "react"

import { Icon } from "@iconify/react"

import {
  Typography,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
} from "@mui/material"

const Accordion = MuiAccordion

interface AccordionItemProps {
  value: string
  className?: string
  children?: React.ReactNode
}

const AccordionItem = ({ value, className, children, ...props }: AccordionItemProps) => (
    <MuiAccordion className={className} {...props}>
      {children}
    </MuiAccordion>
  )

interface AccordionTriggerProps {
  className?: string
  children?: React.ReactNode
}

const AccordionTrigger = ({ className, children, ...props }: AccordionTriggerProps) => (
    <MuiAccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />} className={className} {...props}>
      <Typography>{children}</Typography>
    </MuiAccordionSummary>
  )

interface AccordionContentProps {
  className?: string
  children?: React.ReactNode
}

const AccordionContent = ({ className, children, ...props }: AccordionContentProps) => (
    <MuiAccordionDetails className={className} {...props}>
      {children}
    </MuiAccordionDetails>
  )

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
