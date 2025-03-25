import { useState, useRef } from "react";
import { Container, Textarea, Button, Title, Group } from "@mantine/core";
import Head from "next/head";

export default function Home() {
  const [message, setMessage] = useState("");
  const [formattedMessage, setFormattedMessage] = useState("");
  const [selectedText, setSelectedText] = useState<{ start: number; end: number; text: string }>({ start: 0, end: 0, text: "" });
  const [currentTextColor, setCurrentTextColor] = useState<keyof typeof textColors>("white");
  const [currentBgColor, setCurrentBgColor] = useState<keyof typeof bgColors>("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ANSI color codes for Discord
  const textColors = {
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    purple: "\u001b[35m",
    cyan: "\u001b[36m",
    white: "\u001b[37m",
  };

  const bgColors = {
    DarkBlue: "\u001b[41m",
    Orange: "\u001b[41m",
    Blue: "\u001b[42m",
    Turquoise: "\u001b[43m",
    Gray: "\u001b[44m",
    Indigo: "\u001b[45m",
    LightGray: "\u001b[46m",
    white: "\u001b[47m",
    none: "", // No background color
  };

  const handleTextSelection = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      setSelectedText({ start, end, text: message.substring(start, end) });
    }
  };

  const applyColor = () => {
    if (!selectedText.text) return;
    const { start, end, text } = selectedText;
    const textAnsi = textColors[currentTextColor] || "";
    const bgAnsi = bgColors[currentBgColor] || "";
    const mainString = `${textAnsi}${bgAnsi}${text}\u001b[0m`;
    const newMessage =
      "```ansi\n" +
      message.substring(0, start) +
      mainString +
      message.substring(end) +
      "\n```";
    setFormattedMessage(newMessage);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedMessage);
  };
  return (
    <Container size="sm" py="xl">
      <Title mb="lg">🎨 Discord Color Message Generator</Title>
      

      <Textarea
        label="Enter your message"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        ref={textareaRef}
        minRows={3}
        autosize
        mb="sm"
        onSelect={handleTextSelection}
      />

      <Title order={4} mt="md">Choose Text Color:</Title>
      <Group mt="xs" mb="md">
        {Object.keys(textColors).map((color) => (
          <Button key={color} color={color} onClick={() => setCurrentTextColor(color as keyof typeof textColors)}>
            {color}
          </Button>
        ))}
      </Group>

      <Title order={4} mt="md">Choose Background Color:</Title>
      <Group mt="xs">
        {Object.keys(bgColors).map((color) => (
          <Button key={color} color={color} onClick={() => setCurrentBgColor(color as keyof typeof bgColors)}>
            {color}
          </Button>
        ))}
      </Group>

      <Group mt="xs">
        <Button color="blue" onClick={applyColor}>Apply Color</Button>
        <Button color="teal" onClick={copyToClipboard}>Copy</Button>
      </Group>

      {formattedMessage && (
        <Textarea
          label="Formatted ANSI Message"
          value={formattedMessage}
          readOnly
          autosize
          minRows={3}
          mt="md"
        />
      )}
    </Container>
  );
}

