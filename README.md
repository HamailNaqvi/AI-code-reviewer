# ZipTag — AI Code Reviewer

**ZipTag** is an AI-powered code review application that analyzes source code and generates structured, actionable feedback across **code quality, bugs, readability, UI/UX, and security**.

The application combines a web-based frontend with a backend API and Large Language Model (LLM) integration to transform submitted source code into a structured technical review.

---

## Overview

Traditional code review can be time-consuming, particularly when developers need to identify common bugs, readability issues, security concerns, and areas for improvement across large sections of code.

ZipTag provides an AI-assisted approach to this process.

Users submit their code through the web interface, after which the application:

1. Packages the submitted code into a JSON request.
2. Sends the request to the backend.
3. The backend forwards the relevant data to an LLM through an API.
4. The LLM evaluates the code against a predefined set of review criteria.
5. The backend processes the response.
6. The frontend presents the results as a structured code review.

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ Submit Code
       ▼
┌──────────────────┐
│     Frontend     │
│ HTML / JS /      │
│ Tailwind / CSS   │
└────────┬─────────┘
         │
         │ JSON Request
         ▼
┌──────────────────┐
│     Backend      │
│ Request Handling │
│ & API Processing │
└────────┬─────────┘
         │
         │ LLM API Request
         ▼
┌──────────────────┐
│       LLM        │
│  Code Analysis   │
└────────┬─────────┘
         │
         │ Structured Response
         ▼
┌──────────────────┐
│     Frontend     │
│ Review Dashboard │
└──────────────────┘
```

---

## Key Features

### Code Analysis

ZipTag evaluates submitted code and provides a structured assessment including:

* **Programming language detection**
* **Overall code quality**
* **Bug detection**
* **Bug count**
* **Improvement suggestions**
* **Readability score**
* **Potential threats**
* **Detailed technical feedback**

### UI/UX Analysis

ZipTag provides a dedicated UI/UX review where applicable.

The AI can identify potential improvements relating to:

* User interface
* Usability
* Layout
* User experience
* Design consistency
* Interaction patterns

When no relevant UI/UX issues are identified, the system returns `None` rather than generating unnecessary recommendations.

### Security Analysis

A dedicated security review evaluates the submitted code for potential vulnerabilities and obvious security risks.

This includes identifying:

* Potential vulnerabilities
* Unsafe coding practices
* Suspicious implementation patterns
* Potential security threats

When no relevant vulnerabilities are detected, the system returns `None`.

---

# AI Review Structure

ZipTag does not rely on a completely open-ended AI response.

Instead, the backend provides the LLM with a **predefined set of review requirements**.

This allows the application to receive consistent information that can be processed and displayed by the frontend.

The review is divided into three primary sections.

### 1. Detailed Code Review

Provides an in-depth assessment of the submitted source code.

This section focuses on:

* Bugs
* Code quality
* Logic
* Maintainability
* Readability
* Improvement opportunities

### 2. UI/UX Review

Evaluates the user-facing aspects of the project where applicable.

The AI identifies potential improvements and explains why they may improve the overall user experience.

### 3. Security Vulnerability Review

Focuses specifically on security-related concerns within the submitted code.

Potential vulnerabilities and risky implementation patterns are highlighted for further investigation.

---

# Technology Stack

| Technology       | Role                                     |
| ---------------- | ---------------------------------------- |
| **HTML**         | Frontend structure                       |
| **JavaScript**   | Client-side functionality                |
| **Tailwind CSS** | Primary UI styling                       |
| **CSS**          | Additional styling and customisation     |
| **JSON**         | Frontend ↔ backend data exchange         |
| **Backend API**  | Request processing and LLM communication |
| **LLM API**      | AI-powered code analysis                 |

The frontend is primarily built using **Tailwind CSS and custom CSS**, with JavaScript handling the application logic and communication with the backend.

---

# Application Architecture

ZipTag follows a lightweight client-server architecture.

```text
                 ┌─────────────────────┐
                 │       ZIPTAG        │
                 │   AI Code Reviewer  │
                 └──────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │  Frontend   │             │   Backend   │
       │             │             │             │
       │ HTML        │             │ API         │
       │ JavaScript  │◄───────────►│ JSON        │
       │ Tailwind    │             │ Processing  │
       │ CSS         │             │             │
       └──────┬──────┘             └──────┬──────┘
              │                           │
              │                           │
              │                           ▼
              │                    ┌─────────────┐
              │                    │  LLM API    │
              │                    │             │
              │                    │ Code        │
              │                    │ Analysis    │
              │                    └──────┬──────┘
              │                           │
              └──────────── Results ◄─────┘
```

---

# Request & Response Flow

## 1. User Input

The user submits source code through the ZipTag interface.

## 2. JSON Payload

The frontend packages the relevant information into a JSON request.

Conceptually:

```json
{
  "code": "user submitted source code"
}
```

## 3. Backend Processing

The backend receives the request and prepares the code for AI analysis.

The backend is responsible for communicating with the external LLM API rather than exposing the API integration directly to the client.

## 4. LLM Analysis

The backend sends the code together with the predefined review criteria.

The LLM analyzes the submitted code and produces the requested review information.

## 5. Structured Results

The backend receives the AI response and returns the relevant information to the frontend.

## 6. Review Dashboard

The frontend presents the results in a structured format, allowing the user to quickly understand the state of their code.

---

# Review Metrics

ZipTag provides several high-level metrics to give users an immediate overview of their code.

| Metric           | Description                              |
| ---------------- | ---------------------------------------- |
| **Language**     | Detected programming language            |
| **Code Quality** | Overall assessment of the submitted code |
| **Bugs Found**   | Number of identified bugs                |
| **Improvements** | Number of suggested improvements         |
| **Readability**  | AI-generated readability assessment      |
| **Threats**      | Potential security threats identified    |

These high-level metrics are followed by the more detailed AI-generated reviews.

---

# User Interface

The interface is designed around a simple review workflow.

At the top of the application, users can view the **source code being analysed**.

The analysis is then presented through structured sections so that users can distinguish between:

* General code feedback
* UI/UX recommendations
* Security findings

This separation prevents different types of feedback from being mixed together and makes the review easier to interpret.

---

# Example Output

A simplified example of the type of information ZipTag can provide:

```text
Language
Python

Code Quality
Good

Bugs Found
3

Suggested Improvements
6

Readability
82/100

Threats
1
```

### Detailed Review

The AI provides an explanation of the detected issues and recommendations for improving the implementation.

### UI/UX Review

Potential interface and usability improvements are presented where applicable.

### Security Review

Potential security vulnerabilities and risky coding practices are highlighted for further investigation.

---

# Project Structure

A simplified representation of the project architecture:

```text
AI Code Reviewer/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── API
│   ├── request handling
│   └── LLM integration
│
├── README.md
└── ...
```

> The exact structure may vary depending on the current implementation.

---

# Development

The project is separated into two main responsibilities:

### Frontend

Responsible for:

* User interaction
* Code submission
* JSON request creation
* Review presentation
* UI styling

### Backend

Responsible for:

* Receiving frontend requests
* Processing JSON data
* Communicating with the LLM API
* Handling AI responses
* Returning results to the frontend

This separation allows the frontend and AI integration layers to be developed independently.

---

# Limitations

ZipTag is an **AI-assisted code review tool**, not a replacement for professional software testing or security auditing.

AI-generated analysis can contain:

* False positives
* False negatives
* Incomplete recommendations
* Incorrect interpretations of code

Security findings should therefore be manually verified before being treated as confirmed vulnerabilities.

---

# Future Development

Planned or potential improvements include:

* [ ] GitHub repository integration
* [ ] GitLab integration
* [ ] Automated repository-wide analysis
* [ ] Line-by-line code explanations
* [ ] AI-generated code fixes
* [ ] Multiple LLM provider support
* [ ] Expanded security analysis
* [ ] Static analysis integration
* [ ] Code review history
* [ ] User authentication
* [ ] Downloadable review reports
* [ ] CI/CD integration
* [ ] Support for larger codebases
* [ ] Additional programming languages

---

# Project Goals

The long-term goal of ZipTag is to evolve from a simple AI code reviewer into a more comprehensive **AI-assisted developer tool** capable of helping developers understand, improve, and maintain their code.

The project focuses on combining:

**Developer Tools + AI + Automated Code Analysis + Security + UX**

into a single accessible platform.

---

# Disclaimer

ZipTag provides AI-generated analysis for educational and development assistance purposes.

The results generated by the system should not be considered a definitive security audit, formal code review, or guarantee that software is free from bugs or vulnerabilities.

Developers should independently verify important findings before making changes to production systems.

---

## Author

**Syed Muhammad Hamail Naqvi**

Computer Science & AI Student
Software Development | Artificial Intelligence | Web Development

---

## Project

**ZipTag — AI Code Reviewer**

An AI-powered application for analysing source code and generating structured developer feedback.
