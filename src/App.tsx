import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from "firebase/auth";
import { initAuth, googleSignIn, logout } from "./lib/firebase";

import { Landing } from "./pages/Landing";
import { SystemFlow } from "./pages/SystemFlow";
import { LeadPipeline } from "./pages/LeadPipeline";
import { LeadDiscovery } from "./pages/LeadDiscovery";
import { LeadverseGuide } from "./pages/LeadverseGuide";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-dot-pattern flex flex-col font-sans text-[#111]">
        <main className="flex-1 flex flex-col h-full items-center justify-center relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/system" element={<SystemFlow />} />
            <Route path="/pipeline" element={<LeadPipeline />} />
            <Route path="/discovery" element={<LeadDiscovery />} />
            <Route path="/leadverse" element={<LeadverseGuide />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


