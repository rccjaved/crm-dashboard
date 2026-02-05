"use client";
import { useRouter } from "next/navigation";
import Layout from "../../../../app/components/Layout";
import LeadPropertyEvidenceForm from "../../../../components/LeadPropertyEvidenceForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PropertyEvidencePage({ params }) {
  const router = useRouter();
  const { id } = params;

  const handleClose = () => {
    router.push("/leads");
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <LeadPropertyEvidenceForm leadId={id} isOpen={true} inline={true} onClose={handleClose} />
        </div>
        <ToastContainer position="top-right" />
      </div>
    </Layout>
  );
}
