import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

// Pages
import Home from "./pages/Home";
import Family from "./pages/Family";
import Skiing from "./pages/Skiing";
import Boxing from "./pages/Boxing";
import Iceland from "./pages/Iceland";
import Marathon from "./pages/Marathon";
import Petition from "./pages/Petition";
import Kitchen from "./pages/Kitchen";
import Tedx from "./pages/Tedx";
import Acting from "./pages/Acting";
import Fundraise2026 from "./pages/Fundraise2026";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/family" component={Family} />
        <Route path="/skiing" component={Skiing} />
        <Route path="/boxing" component={Boxing} />
        <Route path="/iceland" component={Iceland} />
        <Route path="/marathon" component={Marathon} />
        <Route path="/petition" component={Petition} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/tedx" component={Tedx} />
        <Route path="/acting" component={Acting} />
        <Route path="/child-hunger" component={Fundraise2026} />
        <Route path="/fundraise2026" component={Fundraise2026} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
