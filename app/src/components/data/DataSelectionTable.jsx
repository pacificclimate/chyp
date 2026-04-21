import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  getAvailableOptions,
  downloadTimeseries,
} from "../../services/timeseriesApi.js";
import "./DataSelection.css";

const HISTORICAL_SCENARIO = "historical";
const HISTORICAL_MODEL = "PNWNAmet";

const getModelLabel = (model) =>
  model === HISTORICAL_MODEL ? `${model} (historical)` : model;

const getScenarioLabel = (scenario) =>
  scenario === HISTORICAL_SCENARIO ? `${scenario} (PNWNAmet only)` : scenario;

const DataSelectionTable = ({ featureId, onClose }) => {
  const outletId = `${featureId}`;
  const [options, setOptions] = useState({
    models: [],
    scenarios: [],
    variables: [],
  });
  const [selections, setSelections] = useState({
    model: "",
    scenario: "",
    variable: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const availableOptions = await getAvailableOptions(outletId);
        setOptions(availableOptions);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        alert("Failed to load available options");
      } finally {
        setIsFetching(false);
      }
    };

    fetchOptions();
  }, [outletId]);

  const handleChange = (field, value) => {
    setSelections((prev) => {
      const isNowInvalid =
        field === "model" &&
        prev.scenario !== "" &&
        (value === HISTORICAL_MODEL) !==
          (prev.scenario === HISTORICAL_SCENARIO);

      return {
        ...prev,
        [field]: value,
        ...(isNowInvalid ? { scenario: "" } : {}),
      };
    });
  };

  const getValidationClass = (field) =>
    showValidation && !selections[field] ? "invalid" : "";

  const handleDownload = useCallback(async () => {
    if (Object.values(selections).some((v) => !v)) {
      setShowValidation(true);
      setShake(true);
      setTimeout(() => setShake(false), 650);
      return;
    }

    setIsLoading(true);
    try {
      await downloadTimeseries(outletId, selections);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download data");
    } finally {
      setIsLoading(false);
    }
  }, [outletId, selections]);

  return (
    <div className={`data-selection ${shake ? "shake" : ""}`}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="header">
          <h2>Download Timeseries Data</h2>
          <button type="button" onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <select
          value={selections.model}
          onChange={(e) => handleChange("model", e.target.value)}
          className={getValidationClass("model")}
          disabled={isFetching}
        >
          <option value="">{isFetching ? "Loading..." : "Select Model"}</option>
          {options.models.map((model) => (
            <option key={model} value={model}>
              {getModelLabel(model)}
            </option>
          ))}
        </select>

        <select
          value={selections.scenario}
          onChange={(e) => handleChange("scenario", e.target.value)}
          className={getValidationClass("scenario")}
          disabled={isFetching}
        >
          <option value="">
            {isFetching ? "Loading..." : "Select Scenario"}
          </option>
          {options.scenarios.map((scenario) => (
            <option
              key={scenario}
              value={scenario}
              disabled={
                (scenario === HISTORICAL_SCENARIO &&
                  selections.model !== "" &&
                  selections.model !== HISTORICAL_MODEL) ||
                (scenario !== HISTORICAL_SCENARIO &&
                  selections.model === HISTORICAL_MODEL)
              }
            >
              {getScenarioLabel(scenario)}
            </option>
          ))}
        </select>

        <select
          value={selections.variable}
          onChange={(e) => handleChange("variable", e.target.value)}
          className={getValidationClass("variable")}
          disabled={isFetching}
        >
          <option value="">
            {isFetching ? "Loading..." : "Select Variable"}
          </option>
          {options.variables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleDownload} disabled={isLoading}>
          {isLoading ? "Downloading..." : "Download CSV"}
        </button>
      </form>
    </div>
  );
};

DataSelectionTable.propTypes = {
  featureId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DataSelectionTable;
