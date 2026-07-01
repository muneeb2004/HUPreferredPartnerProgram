import { NewsletterArchiveList } from "@/components/domain/newsletters/NewsletterArchiveList";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Newsletters | HU Preferred Partner',
  description: 'Past issues and updates.',
};

export default function NewslettersPage() {
  return (
    <>
      <SectionHeading 
        title="Newsletter Archive" 
        subtitle="Catch up on past issues of the Preferred Partner Newsletter." 
      />
      <NewsletterArchiveList newsletters={[]} />
    </>
  );
}
