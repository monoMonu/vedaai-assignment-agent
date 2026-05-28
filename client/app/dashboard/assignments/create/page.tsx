"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Plus, Mic, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { socket } from "@/lib/socket";

export default function CreateAssignmentPage() {
  const {
    currentAssignment,
    setAssignmentField,
    generationStatus,
    setGenerationStatus,
    setActiveAssignment,
    setActivePaperId,
  } = useAssignmentStore();
  const [error, setError] = useState("");

  const questionConfigs = currentAssignment.questionConfigs || [];
  
  const totalQuestions = questionConfigs.reduce((sum, config) => sum + (config.count || 0), 0);
  const totalMarks = questionConfigs.reduce((sum, config) => sum + ((config.count || 0) * (config.marks || 0)), 0);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  useEffect(() => {
    socket.connect();

    const handleProcessing = () => {
      setGenerationStatus("processing");
    };

    const handleCompleted = (payload: { paperId: string }) => {
      setGenerationStatus("completed");
      setActivePaperId(payload.paperId);
    };

    const handleFailed = () => {
      setGenerationStatus("failed");
      setError("AI generation failed. Please try again.");
    };

    socket.on("generation-processing", handleProcessing);
    socket.on("generation-completed", handleCompleted);
    socket.on("generation-failed", handleFailed);

    return () => {
      socket.off("generation-processing", handleProcessing);
      socket.off("generation-completed", handleCompleted);
      socket.off("generation-failed", handleFailed);
    };
  }, [setActivePaperId, setGenerationStatus]);

  const addRow = () => {
    const newRow = { id: Date.now().toString() + Math.random().toString(), type: "", count: 1, marks: 1 };
    setAssignmentField("questionConfigs", [...questionConfigs, newRow]);
  };

  const updateRow = (id: string, field: string, value: any) => {
    const updated = questionConfigs.map((config) =>
      config.id === id ? { ...config, [field]: value } : config
    );
    setAssignmentField("questionConfigs", updated);
  };

  const removeRow = (id: string) => {
    const filtered = questionConfigs.filter((config) => config.id !== id);
    setAssignmentField("questionConfigs", filtered);
  };

  const handleSubmit = async () => {
    setError("");

    if (!currentAssignment.dueDate || totalQuestions === 0) {
      setError("Please set a due date and add at least one question configuration.");
      return;
    }

    setGenerationStatus("pending");

    try {
      const payload = {
        title: currentAssignment.title,
        instructions: currentAssignment.instructions || "",
        totalMarks,
        numberOfQuestions: totalQuestions,
        questionConfigs: currentAssignment.questionConfigs,
        dueDate: currentAssignment.dueDate,
      };

      const response = await fetch(`${baseUrl}/api/assignments/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to start generation");

      const data = await response.json();
      setActiveAssignment({ id: data.assignmentId, title: currentAssignment.title || "Untitled Assignment" });
      
      socket.emit("join-assignment", data.assignmentId);

    } catch (err) {
      setGenerationStatus("failed");
      setError("An error occurred while connecting to the server.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Create Assignment</h1>
          <p className="text-muted-foreground text-sm">Set up a new assignment for your students</p>
        </div>
      </div>

      {error && <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl mb-6 font-medium">{error}</div>}

      {generationStatus !== "idle" && (
        <div className="mb-6 rounded-2xl border border-border bg-sidebar/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Generation {generationStatus}</p>
              <p className="text-sm text-muted-foreground">
                Your assignment is being processed in the background. You can keep working and follow the tracker in the corner.
              </p>
            </div>
            <div className="h-3 w-24 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${generationStatus === "failed" ? "w-full bg-destructive" : generationStatus === "completed" ? "w-full bg-emerald-500" : "w-2/3 bg-brand animate-pulse"}`} />
            </div>
          </div>
        </div>
      )}

      <Card className="max-w-5xl mx-auto rounded-[2rem] shadow-sm border-border/50 bg-sidebar/40 px-2 py-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-foreground">Assignment Details</CardTitle>
          <CardDescription className="text-muted-foreground">Basic information about your assignment</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center bg-sidebar/30 hover:bg-sidebar/50 transition cursor-pointer">
            <UploadCloud className="text-muted-foreground mb-3" size={32} />
            <p className="font-medium text-foreground">Choose a file or drag & drop it here</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">JPEG, PNG, upto 10MB</p>
            <Button variant="outline" className="rounded-full px-6 bg-background">
              Browse Files
            </Button>
            <p className="rounded-full px-4 py-1 bg-destructive/20 mt-4">Not implemented file upload yet</p>
          </div>

          <div>
            <label className="block text-base font-bold text-foreground mb-2">Title</label>
            <Input 
              type="text" 
              value={currentAssignment.title || ""}
              onChange={(e) => setAssignmentField("title", e.target.value)}
              className="rounded-xl px-4 py-6 text-foreground" 
            />
          </div>

          <div>
            <label className="block text-base font-bold text-foreground mb-2">Due Date</label>
            <Input 
              type="date" 
              value={currentAssignment.dueDate || ""}
              onChange={(e) => setAssignmentField("dueDate", e.target.value)}
              className="rounded-xl px-4 py-6 bg-background uppercase text-muted-foreground" 
            />
          </div>

          <div className="py-2">
            <div className="grid grid-cols-[1fr_24px_140px_96px] gap-4 mb-2 items-center">
              <span className="text-base font-bold">Question Type</span>
              <span className="w-6"></span>
              <span className="text-base font-semibold text-muted-foreground text-center whitespace-nowrap">No. of Questions</span>
              <span className="text-base font-semibold text-muted-foreground text-center whitespace-nowrap">Marks</span>
            </div>
            
            <div className="space-y-3">
              {questionConfigs.map((config) => (
                <div key={config.id} className="grid grid-cols-[1fr_24px_140px_96px] gap-4 items-center">
                  <Select value={config.type} onValueChange={(val) => updateRow(config.id, "type", val)}>
                    <SelectTrigger className="bg-sidebar rounded-lg min-h-11 px-2 w-full text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice Questions">Multiple Choice Questions</SelectItem>
                      <SelectItem value="Short Questions">Short Questions</SelectItem>
                      <SelectItem value="Diagram/Graph-Based">Diagram/Graph-Based Questions</SelectItem>
                      <SelectItem value="Numerical Problems">Numerical Problems</SelectItem>
                      <SelectItem value="Long Answer">Long Answer</SelectItem>
                    </SelectContent>
                  </Select>

                  <button 
                    onClick={() => removeRow(config.id)}
                    className="w-6 h-11 flex items-center justify-center text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex items-center justify-between border border-input rounded-lg bg-background px-2 py-1 h-11 w-full">
                    <button 
                      onClick={() => updateRow(config.id, "count", Math.max(1, config.count - 1))}
                      className="text-muted-foreground hover:text-foreground transition px-2"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-base text-foreground">{config.count}</span>
                    <button 
                      onClick={() => updateRow(config.id, "count", config.count + 1)}
                      className="text-muted-foreground hover:text-foreground transition px-2"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border border-input rounded-lg bg-background px-2 py-1 h-11 w-full">
                    <button 
                      onClick={() => updateRow(config.id, "marks", Math.max(1, config.marks - 1))}
                      className="text-muted-foreground hover:text-foreground transition px-2"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-base text-foreground">{config.marks}</span>
                    <button 
                      onClick={() => updateRow(config.id, "marks", config.marks + 1)}
                      className="text-muted-foreground hover:text-foreground transition px-2"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="flex items-center gap-2 mt-4 font-bold text-foreground bg-transparent border-none shadow-none"
            >
              <span 
                className="rounded-full w-8 h-8 bg-foreground flex justify-center items-center"
                onClick={addRow}
              >
                <Plus size={16} className="text-primary-foreground" />
              </span>
              Add Question Type
            </button>
          </div>

          <div className="text-right text-base text-muted-foreground font-medium">
            <p>Total Questions : <span className="text-foreground">{totalQuestions}</span></p>
            <p>Total Marks : <span className="text-foreground">{totalMarks}</span></p>
          </div>

          <div>
            <label className="block text-base font-bold text-foreground mb-2">Additional Information (For better output)</label>
            <div className="relative">
              <Textarea 
                value={currentAssignment.instructions || ""}
                onChange={(e) => setAssignmentField("instructions", e.target.value)}
                className="rounded-xl px-4 py-3 bg-sidebar resize-none min-h-30 focus-visible:ring-1"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
              />
              <button className="absolute bottom-4 right-4 p-2 bg-background rounded-full shadow-sm border border-border hover:bg-sidebar transition">
                <Mic size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-5xl mt-6 mx-auto flex justify-center items-center">
        {/* <Button variant="outline" className="rounded-full px-6 py-6 font-medium shadow-sm bg-primary-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleSubmit} className="rounded-full px-8 py-6 font-medium shadow-md">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button> */}
        <Button onClick={handleSubmit} className="rounded-full px-8 py-6 font-medium shadow-md">
          Submit
        </Button>
      </div>
    </div>
  );
}