import React, { ReactNode, useState } from "react";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const padding = "20px";

  const toggleAccordion = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  return (
        <div
        style={{
            overflow: "hidden",
        }}
        >
        {/* Accordion Header */}
        <div
            onClick={toggleAccordion}
            style={{
                background: isOpen ? "#3182ce" : "transparent",
                color: isOpen ? "#fff" : "#333",
                padding: padding,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {title}
            <span style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            ▶
            </span>
        </div>

        {/* Accordion Content */}
        {isOpen && (
            <div
            style={{
                padding: padding,
                background: "transparent",
                color: "#333"
            }}
            >
            {children}
            </div>
        )}
    </div>
  );
};

export default AccordionItem;