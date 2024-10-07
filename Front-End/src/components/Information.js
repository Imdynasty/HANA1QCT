import { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useDisclosure,
  AccordionIcon,
} from "@chakra-ui/react";

function CollapseEx({ title, content }) {
  const { isOpen, onToggle } = useDisclosure();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("transitionend", () => {});
    }
  }, []);

  return (
    <Accordion allowToggle onChange={onToggle}>
      <AccordionItem mb="4">
        <h2>
          <AccordionButton
            transition="all 0.3s ease-in-out"
            transform={isOpen ? "scale(1.05)" : "scale(0.996)"}
            color={isOpen ? "#09d6b0" : "white"}
            width="100%"
            fontWeight="bold"
            border="none"
            sx={{
              "&:focus:not(:focus-visible)": {
                boxShadow: "none",
                outline: "none",
              },
            }}
            background="none"
            fontSize={"1.9em"}>
            {title}
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel
          pb={4}
          ref={ref}
          textAlign="left"
          style={{
            transition: "ease-in-out 0.3s",
            color: isOpen ? "#01fcce" : "white",
          }}>
          {content}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default CollapseEx;
