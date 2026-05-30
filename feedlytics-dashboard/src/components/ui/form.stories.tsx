/**
 * Showcases the full RHF + Zod + FormField/FormMessage flow. Enter any email
 * shorter than 8 chars to see the validation message.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Values = z.infer<typeof schema>;

function Demo() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="flex w-[420px] flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="mail@feedlytics.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Min. 8 characters" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="brand" size="lg">
          Submit
        </Button>
      </form>
    </Form>
  );
}

const meta: Meta<typeof Demo> = {
  title: "UI/Atoms/Form",
  component: Demo,
};
export default meta;

type Story = StoryObj<typeof Demo>;

export const Basic: Story = {};
