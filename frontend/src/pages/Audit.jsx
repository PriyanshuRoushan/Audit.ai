import { useEffect, useState } from "react";
import { tools } from "../data/tools";

export default function Audit() {

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("audit-form");

    return saved
      ? JSON.parse(saved)
      : {
          selectedTools: [],
          teamSize: "",
          useCase: ""
        };
  });

  // Save automatically
  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(formData));
  }, [formData]);

  // Toggle tool selection
  const toggleTool = (toolId) => {
    const exists = formData.selectedTools.find(
      (tool) => tool.id === toolId
    );

    if (exists) {
      setFormData({
        ...formData,
        selectedTools: formData.selectedTools.filter(
          (tool) => tool.id !== toolId
        )
      });
    } else {
      setFormData({
        ...formData,
        selectedTools: [
          ...formData.selectedTools,
          {
            id: toolId,
            plan: "",
            spend: "",
            seats: ""
          }
        ]
      });
    }
  };

  // Update tool data
  const updateToolData = (toolId, field, value) => {
    setFormData({
      ...formData,
      selectedTools: formData.selectedTools.map((tool) =>
        tool.id === toolId
          ? { ...tool, [field]: value }
          : tool
      )
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Spend Audit</h1>

      <h2>Select Tools</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {tools.map((tool) => {
          const selected = formData.selectedTools.find(
            (t) => t.id === tool.id
          );

          return (
            <div
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              style={{
                border: selected
                  ? "2px solid #8b5cf6"
                  : "1px solid #444",
                padding: "20px",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              <h3>{tool.name}</h3>
            </div>
          );
        })}
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Usage Details
      </h2>

      {formData.selectedTools.map((selectedTool) => {
        const toolInfo = tools.find(
          (tool) => tool.id === selectedTool.id
        );

        return (
          <div
            key={selectedTool.id}
            style={{
              border: "1px solid #444",
              padding: "20px",
              borderRadius: "12px",
              marginTop: "20px"
            }}
          >
            <h3>{toolInfo.name}</h3>

            <select
              value={selectedTool.plan}
              onChange={(e) =>
                updateToolData(
                  selectedTool.id,
                  "plan",
                  e.target.value
                )
              }
            >
              <option value="">
                Select Plan
              </option>

              {toolInfo.plans.map((plan) => (
                <option key={plan}>
                  {plan}
                </option>
              ))}
            </select>

            <br />
            <br />

            <input
              type="number"
              placeholder="Monthly Spend ($)"
              value={selectedTool.spend}
              onChange={(e) =>
                updateToolData(
                  selectedTool.id,
                  "spend",
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Number of Seats"
              value={selectedTool.seats}
              onChange={(e) =>
                updateToolData(
                  selectedTool.id,
                  "seats",
                  e.target.value
                )
              }
            />
          </div>
        );
      })}

      <div style={{ marginTop: "40px" }}>
        <input
          type="number"
          placeholder="Total Team Size"
          value={formData.teamSize}
          onChange={(e) =>
            setFormData({
              ...formData,
              teamSize: e.target.value
            })
          }
        />

        <br />
        <br />

        <select
          value={formData.useCase}
          onChange={(e) =>
            setFormData({
              ...formData,
              useCase: e.target.value
            })
          }
        >
          <option value="">
            Primary Use Case
          </option>

          <option value="coding">
            Coding
          </option>

          <option value="writing">
            Writing
          </option>

          <option value="research">
            Research
          </option>

          <option value="mixed">
            Mixed
          </option>
        </select>
      </div>

      <pre
        style={{
          marginTop: "40px",
          background: "#111",
          padding: "20px"
        }}
      >
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
}