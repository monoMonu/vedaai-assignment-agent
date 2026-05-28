"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IPaper } from "@/types";
import { useUserStore } from "@/store/useUserStore";

export default function PaperOutputPage() {
  const { id } = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<IPaper | null>(null);
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
        const response = await fetch(`${baseUrl}/api/papers/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch paper");
        }

        const data = await response.json();
        setPaper(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaper();
    }
  }, [id]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <span className="bg-green-100 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded-md font-inter font-semibold">Easy</span>;
      case "moderate":
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs px-2 py-0.5 rounded-md font-inter font-semibold">Moderate</span>;
      case "hard":
        return <span className="bg-red-100 text-red-700 border border-red-200 text-xs px-2 py-0.5 rounded-md font-inter font-semibold">Hard</span>;
      default:
        return <span className="bg-muted text-muted-foreground border border-border text-xs px-2 py-0.5 rounded-md font-inter font-semibold">{difficulty}</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotalMarks = () => {
    return paper?.sections.reduce((sectionTotal, section) => {
      return sectionTotal + section.questions.reduce((questionTotal, question) => questionTotal + question.marks, 0);
    }, 0) ?? 0;
  };

  const getTotalQuestions = () => {
    return paper?.sections.reduce((sectionTotal, section) => sectionTotal + section.questions.length, 0) ?? 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand mb-4"></div>
        <p className="text-muted-foreground font-inter font-medium">Retrieving generated paper...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-inter font-bold text-foreground">Paper Not Found</h2>
        <Button onClick={() => router.push('/assignments')} className="mt-4">Return to Assignments</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="ghost" onClick={() => router.push('/dashboard/assignments')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePrint} className="bg-background">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button className="bg-[#1a1a1a] hover:bg-black text-white shadow-md">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <Card className="bg-white rounded-none md:rounded-sm shadow-xl border-border print:shadow-none print:border-none">
        <CardContent className="p-6 sm:p-8 md:p-12 font-inter text-black">
          
          <div className="text-center pb-5 mb-6 space-y-1">
            <h1 className="text-2xl md:text-3xl font-inter font-bold tracking-tight">{user?.schoolName}</h1>
            <p className="text-base font-inter font-semibold">Subject: Subject Name</p>
            <p className="text-sm text-gray-700">Class: Class</p>
          </div>

          <div className="flex justify-between gap-4 mb-8 text-sm">
            <div className="flex gap-2">
              <span className="font-inter font-bold whitespace-nowrap">Time Allowed:</span>
              <span>45 minutes</span>
            </div>
            <div className="flex gap-2">
              <span className="font-inter font-bold whitespace-nowrap">Maximum Marks:</span>
              <span>{getTotalMarks()}</span>
            </div>
          </div>

          <div className="mb-10 text-sm space-y-2 border-b border-dashed border-gray-300 pb-6">
            <p>All questions are compulsory unless stated otherwise.</p>
            <div className="max-w-1/3 flex flex-col gap-2 pt-2">
              {['Name', 'Roll Number', 'Class/Section'].map((el, ind) => (
                <div key={ind} className="flex items-center gap-2">
                  <span className="font-inter font-bold">{el}:</span>
                  <span className="border-b border-black flex-1 h-5"></span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {paper.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-inter font-semibold tracking-tight text-black">{section.title}</h2>
                  <p className="text-sm italic text-gray-700">{section.instruction}</p>
                </div>

                <div className="space-y-5">
                  {section.questions.map((question, qIdx) => (
                    <div key={qIdx} className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-black leading-relaxed text-[15px]">
                          <span className="font-inter font-bold mr-2">{qIdx + 1}.</span>
                          <span className="font-inter font-semibold mr-2">[{question.difficulty}]</span>
                          {question.questionText}
                        </p>
                        {question.options?.length ? (
                          <div className="pl-8 space-y-1 text-[14px]">
                            {question.options.map((option, optionIdx) => (
                              <p key={optionIdx} className="leading-relaxed">
                                {String.fromCharCode(65 + optionIdx)}. {option}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-sm font-inter font-bold text-black whitespace-nowrap pt-1">
                        [{question.marks} Marks]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-black pt-4 text-center text-sm font-inter font-semibold">
            End of Question Paper
          </div>

        </CardContent>
      </Card>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .max-w-4xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-white {
             box-shadow: none !important;
          }
          .CardContent, .CardContent * {
            visibility: visible;
          }
          .CardContent {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}