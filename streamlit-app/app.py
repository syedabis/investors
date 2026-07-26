import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import bcrypt
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

st.set_page_config(
    page_title="Investor Toolkit",
    page_icon="📈",
    layout="wide",
)

# ── Users (username → {name, hashed_password}) ───────────────────────────────
# To add users: generate a hash with bcrypt.hashpw(b"password", bcrypt.gensalt())

USERS = {
    "admin": {
        "name": "Admin",
        "password_hash": b"$2b$12$bno121WMzOisf4yplokRuuRpQflkkyOW6KpYWaN5uYZ/NyyWoPDBG",
    },
    "investor": {
        "name": "Investor",
        "password_hash": b"$2b$12$wJiREXzC5iZ0l3ESng06Leu0NlilIZtFhmpnAdJMeNstsJYvjZl1m",
    },
}

# ── Auth helpers ──────────────────────────────────────────────────────────────

def check_password(username: str, password: str) -> bool:
    user = USERS.get(username)
    if not user:
        return False
    return bcrypt.checkpw(password.encode(), user["password_hash"])

def is_authenticated() -> bool:
    return st.session_state.get("authenticated", False)

def logout():
    st.session_state["authenticated"] = False
    st.session_state.pop("username", None)

# ── Login page ────────────────────────────────────────────────────────────────

def show_login():
    col = st.columns([1, 1.2, 1])[1]
    with col:
        st.markdown("<br><br>", unsafe_allow_html=True)
        st.markdown("## 📈 Investor Toolkit")
        st.markdown("Sign in to access the portfolio dashboard.")
        st.divider()

        with st.form("login_form"):
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            submitted = st.form_submit_button("Sign In", use_container_width=True, type="primary")

        if submitted:
            if check_password(username, password):
                st.session_state["authenticated"] = True
                st.session_state["username"] = username
                st.rerun()
            else:
                st.error("Invalid username or password.")

        st.markdown(
            "<p style='font-size:0.8rem;color:#888;margin-top:1rem;'>"
            "Default accounts — <b>admin</b> / admin123 &nbsp;·&nbsp; <b>investor</b> / investor123"
            "</p>",
            unsafe_allow_html=True,
        )

# ── Guard: show login if not authenticated ────────────────────────────────────

if not is_authenticated():
    show_login()
    st.stop()

# ── Data & Model (only reached when authenticated) ────────────────────────────

@st.cache_data
def load_data():
    return pd.read_csv("50_Startups.csv")

@st.cache_resource
def train_model(df):
    X = df.drop("Profit", axis=1)
    y = df["Profit"]
    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), ["State"]),
        ("num", "passthrough", ["R&D Spend", "Administration", "Marketing Spend"]),
    ])
    pipeline = Pipeline([("preprocessor", preprocessor), ("regressor", LinearRegression())])
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    metrics = {
        "r2": r2_score(y_test, y_pred),
        "rmse": np.sqrt(mean_squared_error(y_test, y_pred)),
        "y_test": y_test,
        "y_pred": y_pred,
    }
    return pipeline, metrics

df = load_data()
model, metrics = train_model(df)

# ── Sidebar ───────────────────────────────────────────────────────────────────

st.sidebar.image("https://img.icons8.com/fluency/96/investment-portfolio.png", width=64)
st.sidebar.title("Investor Toolkit")
username = st.session_state.get("username", "")
st.sidebar.markdown(f"Signed in as **{USERS[username]['name']}**")
if st.sidebar.button("Sign Out", use_container_width=True):
    logout()
    st.rerun()

st.sidebar.divider()
page = st.sidebar.radio("Navigate", ["🏠 Homepage", "📊 Overview", "🔍 Data Explorer", "🤖 Model Performance", "💡 Profit Predictor", "📖 How to Use"])

states = sorted(df["State"].unique().tolist())

# ── Page: Homepage ───────────────────────────────────────────────────────────

if page == "🏠 Homepage":
    st.markdown(
        """
        <div style="text-align:center;padding:2rem 0 1rem;">
            <span style="font-size:4rem;">📈</span>
            <h1 style="font-size:2.8rem;margin:0.4rem 0 0;">Investor Toolkit</h1>
            <p style="font-size:1.15rem;color:#888;margin-top:0.4rem;">
                AI-powered profit intelligence for early-stage investment decisions
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.divider()

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("### 🔬 Data-Driven")
        st.markdown(
            "Built on real startup data spanning R&D, Administration, and Marketing spend "
            "across three US states. Every insight is grounded in numbers, not gut feel."
        )
    with col2:
        st.markdown("### 🤖 ML-Powered")
        st.markdown(
            "A Multiple Linear Regression model trained on 50 startups delivers profit "
            "predictions with an **R² of ~0.90** — strong signal for portfolio screening."
        )
    with col3:
        st.markdown("### ⚡ Instant Predictions")
        st.markdown(
            "Plug in any spend mix and get an estimated profit in seconds. Compare "
            "scenarios side-by-side to prioritise where capital creates the most value."
        )

    st.divider()

    st.markdown("## What's inside")
    features = [
        ("📊", "Portfolio Overview", "High-level KPIs, profit distribution, state comparison, and correlation heatmap."),
        ("🔍", "Data Explorer", "Browse raw startup data, run scatter analyses, and inspect summary statistics."),
        ("🤖", "Model Performance", "Evaluate the regression model with actual vs predicted charts and residual analysis."),
        ("💡", "Profit Predictor", "Input spend figures for any startup and receive an instant profit estimate."),
    ]
    cols = st.columns(4)
    for col, (icon, title, desc) in zip(cols, features):
        with col:
            st.markdown(
                f"""
                <div style="border:1px solid #e0e0e0;border-radius:10px;padding:1.2rem;height:180px;">
                    <div style="font-size:2rem;">{icon}</div>
                    <strong>{title}</strong>
                    <p style="font-size:0.85rem;color:#666;margin-top:0.4rem;">{desc}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.divider()

    st.markdown("## Who is this for?")
    left, right = st.columns(2)
    with left:
        st.markdown(
            """
            - **Angel investors** screening early-stage startups for ROI potential
            - **VC analysts** validating spend efficiency before due diligence
            - **Founders** benchmarking their own spend mix against the market
            """
        )
    with right:
        st.markdown(
            """
            - **Accelerator programs** comparing cohort companies at a glance
            - **Finance students** learning applied machine learning on real data
            - **Data teams** prototyping investment scoring models
            """
        )

# ── Page: Overview ────────────────────────────────────────────────────────────

elif page == "📊 Overview":
    st.title("📊 Portfolio Overview")
    st.markdown("Analysing **50 startups** across R&D, Administration, and Marketing spend to predict profit.")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Startups", len(df))
    c2.metric("Avg Profit", f"${df['Profit'].mean():,.0f}")
    c3.metric("Max Profit", f"${df['Profit'].max():,.0f}")
    c4.metric("Model R²", f"{metrics['r2']:.3f}")

    st.divider()

    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("Profit Distribution")
        fig = px.histogram(df, x="Profit", nbins=15, color_discrete_sequence=["#4F8EF7"])
        fig.update_layout(bargap=0.05, showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    with col_right:
        st.subheader("Average Profit by State")
        state_avg = df.groupby("State")["Profit"].mean().reset_index().sort_values("Profit", ascending=False)
        fig = px.bar(state_avg, x="State", y="Profit", color="State",
                     color_discrete_sequence=px.colors.qualitative.Pastel)
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Spend vs Profit Correlation")
    spend_cols = ["R&D Spend", "Administration", "Marketing Spend"]
    corr = df[spend_cols + ["Profit"]].corr()
    fig = px.imshow(corr, text_auto=".2f", color_continuous_scale="Blues", aspect="auto")
    st.plotly_chart(fig, use_container_width=True)

# ── Page: Data Explorer ───────────────────────────────────────────────────────

elif page == "🔍 Data Explorer":
    st.title("🔍 Data Explorer")

    with st.expander("Raw Data", expanded=True):
        st.dataframe(df.style.format({
            "R&D Spend": "${:,.2f}",
            "Administration": "${:,.2f}",
            "Marketing Spend": "${:,.2f}",
            "Profit": "${:,.2f}",
        }), use_container_width=True)

    st.subheader("Scatter Analysis")
    x_axis = st.selectbox("X axis", ["R&D Spend", "Administration", "Marketing Spend"])
    color_by = st.checkbox("Color by State", value=True)

    fig = px.scatter(
        df, x=x_axis, y="Profit",
        color="State" if color_by else None,
        trendline="ols",
        hover_data=["R&D Spend", "Administration", "Marketing Spend", "Profit"],
        color_discrete_sequence=px.colors.qualitative.Set2,
    )
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("Summary Statistics")
    st.dataframe(
        df.describe().style.format("${:,.2f}", subset=["R&D Spend", "Administration", "Marketing Spend", "Profit"]),
        use_container_width=True,
    )

# ── Page: Model Performance ───────────────────────────────────────────────────

elif page == "🤖 Model Performance":
    st.title("🤖 Model Performance")
    st.markdown("Multiple Linear Regression with One-Hot Encoding on the **State** column.")

    c1, c2, c3 = st.columns(3)
    c1.metric("R² Score", f"{metrics['r2']:.4f}", help="Proportion of variance explained")
    c2.metric("RMSE", f"${metrics['rmse']:,.0f}", help="Root Mean Squared Error")
    c3.metric("Train / Test Split", "80 / 20")

    st.divider()

    st.subheader("Actual vs Predicted Profit")
    result_df = pd.DataFrame({"Actual": metrics["y_test"], "Predicted": metrics["y_pred"]})
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=result_df["Actual"], y=result_df["Predicted"],
                             mode="markers", marker=dict(color="#4F8EF7", size=10),
                             name="Predictions"))
    min_val = min(result_df["Actual"].min(), result_df["Predicted"].min())
    max_val = max(result_df["Actual"].max(), result_df["Predicted"].max())
    fig.add_trace(go.Scatter(x=[min_val, max_val], y=[min_val, max_val],
                             mode="lines", line=dict(dash="dash", color="gray"),
                             name="Perfect Fit"))
    fig.update_layout(xaxis_title="Actual Profit ($)", yaxis_title="Predicted Profit ($)")
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("Residuals")
    residuals = metrics["y_pred"] - metrics["y_test"].values
    fig = px.bar(x=list(range(len(residuals))), y=residuals,
                 labels={"x": "Test Sample", "y": "Residual ($)"},
                 color=residuals, color_continuous_scale="RdBu_r")
    fig.add_hline(y=0, line_dash="dash", line_color="gray")
    st.plotly_chart(fig, use_container_width=True)

# ── Page: Profit Predictor ────────────────────────────────────────────────────

elif page == "💡 Profit Predictor":
    st.title("💡 Profit Predictor")
    st.markdown("Enter startup spend details below to estimate expected profit.")

    with st.form("predict_form"):
        col1, col2 = st.columns(2)
        with col1:
            rd = st.number_input("R&D Spend ($)", min_value=0.0, max_value=200_000.0,
                                  value=float(df["R&D Spend"].mean()), step=1000.0, format="%.2f")
            admin = st.number_input("Administration ($)", min_value=0.0, max_value=200_000.0,
                                     value=float(df["Administration"].mean()), step=1000.0, format="%.2f")
        with col2:
            mkt = st.number_input("Marketing Spend ($)", min_value=0.0, max_value=500_000.0,
                                   value=float(df["Marketing Spend"].mean()), step=1000.0, format="%.2f")
            state = st.selectbox("State", states)

        submitted = st.form_submit_button("Predict Profit", use_container_width=True, type="primary")

    if submitted:
        input_df = pd.DataFrame([{
            "R&D Spend": rd,
            "Administration": admin,
            "Marketing Spend": mkt,
            "State": state,
        }])
        prediction = model.predict(input_df)[0]

        st.divider()
        st.metric("Estimated Profit", f"${prediction:,.2f}")

        fig = px.histogram(df, x="Profit", nbins=15, color_discrete_sequence=["#d3d3d3"],
                           labels={"Profit": "Profit ($)"})
        fig.add_vline(x=prediction, line_color="#4F8EF7", line_width=3,
                      annotation_text=f"Your prediction: ${prediction:,.0f}",
                      annotation_position="top right")
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

        pct = (df["Profit"] < prediction).mean() * 100
        if pct >= 50:
            st.success(f"This startup is projected to outperform **{pct:.0f}%** of startups in the dataset.")
        else:
            st.warning(f"This startup is projected to outperform **{pct:.0f}%** of startups in the dataset.")

# ── Page: How to Use ─────────────────────────────────────────────────────────

elif page == "📖 How to Use":
    st.title("📖 How to Use Investor Toolkit")
    st.markdown("Follow the steps below to get the most out of each section of the app.")

    st.divider()

    with st.expander("1️⃣  Start with the Portfolio Overview", expanded=True):
        st.markdown(
            """
            Navigate to **📊 Overview** from the sidebar.

            - The **four metric cards** at the top give you an instant snapshot: total startups,
              average profit, peak profit, and the model's R² accuracy score.
            - The **Profit Distribution** histogram shows how profits are spread — look for
              clusters and outliers.
            - The **Average Profit by State** bar chart reveals geography-driven differences.
            - The **Correlation Heatmap** tells you which spend category most closely tracks
              profit. R&D typically dominates — if a startup under-invests there, flag it.
            """
        )

    with st.expander("2️⃣  Explore the Raw Data"):
        st.markdown(
            """
            Navigate to **🔍 Data Explorer**.

            - The **Raw Data table** is fully scrollable and formatted in dollar values.
            - Use the **X axis selector** to switch the scatter plot between R&D, Administration,
              and Marketing Spend. The OLS trendline updates automatically.
            - Toggle **Color by State** to see whether geography explains variance that spend
              alone doesn't.
            - The **Summary Statistics** table at the bottom shows min, max, mean, and quartiles
              for every numeric column — useful for benchmarking a new startup.
            """
        )

    with st.expander("3️⃣  Understand the Model"):
        st.markdown(
            """
            Navigate to **🤖 Model Performance**.

            - **R² Score** — how much of the profit variance the model explains (0 = nothing,
              1 = perfect). Anything above 0.85 is considered strong for a linear model.
            - **RMSE** — average dollar error on test predictions. Use this as your confidence
              interval when reading predictor results.
            - The **Actual vs Predicted** scatter should cluster tightly around the dashed
              perfect-fit line. Points far from the line are startups the model found surprising.
            - The **Residuals** bar chart shows over/under-predictions per test sample.
              A random pattern (no trend) confirms the model is well-specified.
            """
        )

    with st.expander("4️⃣  Run a Profit Prediction"):
        st.markdown(
            """
            Navigate to **💡 Profit Predictor**.

            1. Enter the startup's planned **R&D Spend**, **Administration**, and
               **Marketing Spend** in dollars.
            2. Select the **State** where the startup operates.
            3. Click **Predict Profit**.
            4. The result shows the estimated profit and a histogram marking where that
               prediction sits relative to all 50 startups in the dataset.
            5. The percentile message tells you whether this startup is expected to beat
               the majority or fall below the pack.

            **Tips:**
            - Try sliding R&D Spend up while keeping other fields constant to see how
              much it moves the needle.
            - Use the RMSE from the Model Performance page as a ± margin around the prediction.
            """
        )

    st.divider()
    st.markdown("## Frequently Asked Questions")

    faqs = [
        ("Where does the data come from?",
         "The dataset (`50_Startups.csv`) contains 50 anonymised US startups with spend "
         "breakdowns across R&D, Administration, and Marketing, plus their recorded annual profit."),
        ("How accurate are the predictions?",
         "The model achieves an R² of ~0.90 on the held-out test set, meaning it explains "
         "roughly 90% of profit variance. Check the RMSE on the Model Performance page for "
         "the expected dollar-level error margin."),
        ("Can I add my own data?",
         "Yes — replace `50_Startups.csv` with your own file that has the same column names "
         "(`R&D Spend`, `Administration`, `Marketing Spend`, `State`, `Profit`) and restart the app."),
        ("How do I add or change user accounts?",
         "Open `app.py` and edit the `USERS` dictionary near the top. Generate a new bcrypt hash "
         "with: `python -c \"import bcrypt; print(bcrypt.hashpw(b'yourpassword', bcrypt.gensalt()).decode())\"`"),
    ]

    for q, a in faqs:
        with st.expander(q):
            st.markdown(a)
