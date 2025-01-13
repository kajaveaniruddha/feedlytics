import {
  Laugh,
  Frown,
  Meh
} from "lucide-react"

export const sentiments = [
  {
    value: "positive",
    label: "positive",
    icon:Laugh
  },
  {
    value: "negative",
    label: "negative",
    icon:Frown
  },
  {
    value: "neutral",
    label: "neutral",
    icon:Meh
  },
]

export const ratings = [
  {
    value: "1",
    label: "1 star",
  },
  {
    value: "2",
    label: "2 star",
  },
  {
    value: "3",
    label: "3 star",
  },
  {
    value: "4",
    label: "4 star",
  },
  {
    value: "5",
    label: "5 star",
  },
]

export const categories = [
  {
    value: "praise",
    label: "praise",
  },
  {
    value: "bug",
    label: "bug",
  },
  {
    value: "request",
    label: "request",
  },
  {
    value: "complaint",
    label: "complaint",
  },
  {
    value: "suggestion",
    label: "suggestion",
  },
  {
    value: "question",
    label: "question",
  },
  {
    value: "other",
    label: "other",
  }
]

//   export const priorities = [
//     {
//       label: "Low",
//       value: "low",
//       icon: ArrowDown,
//     },
//     {
//       label: "Medium",
//       value: "medium",
//       icon: ArrowRight,
//     },
//     {
//       label: "High",
//       value: "high",
//       icon: ArrowUp,
//     },
//   ]