import React, { useEffect, useState } from "react";
import Article from "/src/components/wrappers/Article.jsx";
import { useParser } from "/src/helpers/parser.js";
import { Col } from "react-bootstrap";
import FormInput from "/src/components/forms/FormInput.jsx";
import { useLanguage } from "/src/providers/LanguageProvider.jsx";
import FormTextArea from "/src/components/forms/FormTextArea.jsx";
import Form from "/src/components/forms/Form.jsx";
import emails from "/src/helpers/emails.js"; // Ahora usamos el objeto emails directamente
import StatusMessage from "/src/components/generic/StatusMessage.jsx";
import { useTheme } from "/src/providers/ThemeProvider.jsx";
import { useFeedbacks } from "/src/providers/FeedbacksProvider.jsx";

function ArticleContactForm({ data }) {
    const parser = useParser();
    const { showActivitySpinner, hideActivitySpinner, displayNotification } = useFeedbacks();
    const { getString } = useLanguage();
    const { getSelectedTheme } = useTheme();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [didSubmitMessage, setDidSubmitMessage] = useState(false);

    const parsedData = parser.parseArticleData(data);

    useEffect(() => {
        _resetForm();
    }, [getSelectedTheme()]);

    const _resetForm = () => {
        const form = document.getElementById("contact-form");
        if (form) {
            form.reset();
        }
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    const _onSubmitButton = (e) => {
        e.preventDefault();
        showActivitySpinner("submitting");

        setTimeout(async () => {
            await _submitMessage();
        }, 300);
    };

    const _submitMessage = async () => {
        const params = {
            from_name: name,
            from_email: email,
            custom_subject: subject,
            message: message,
        };

        try {
            const success = await emails.sendContactEmail(params);

            if (success) {
                _onSubmitSuccess();
            } else {
                _onSubmitError();
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            _onSubmitError();
        }
    };

    const _onSubmitSuccess = () => {
        hideActivitySpinner("submitting");
        setDidSubmitMessage(true);
    };

    const _onSubmitError = () => {
        hideActivitySpinner("submitting");
        displayNotification("error", getString("uhOh"), getString("message_sent_error"));
    };

    return (
        <Article className={`article-contact-form pb-2`} title={parsedData.title}>
            {!didSubmitMessage && (
                <Form
                    id={`contact-form`}
                    submitIcon={`fa-solid fa-envelope`}
                    submitLabel={getString("send_message")}
                    onSubmit={_onSubmitButton}
                >
                    <Col className={`col-12 col-xl-6`}>
                        <FormInput
                            id={`name`}
                            type={`text`}
                            value={name}
                            valueSetter={setName}
                            faIcon={`fa-solid fa-signature`}
                            placeholder={getString("name")}
                            required={true}
                        />

                        <FormInput
                            id={`email`}
                            type={`email`}
                            value={email}
                            valueSetter={setEmail}
                            faIcon={`fa-solid fa-envelope`}
                            placeholder={getString("email")}
                            required={true}
                        />

                        <FormInput
                            id={`subject`}
                            type={`text`}
                            value={subject}
                            valueSetter={setSubject}
                            faIcon={`fa-solid fa-pen-to-square`}
                            placeholder={getString("subject")}
                            required={true}
                        />
                    </Col>

                    <Col className={`col-12 col-xl-6 d-flex`}>
                        <FormTextArea
                            id={`message`}
                            value={message}
                            valueSetter={setMessage}
                            placeholder={getString("message")}
                            required={true}
                        />
                    </Col>
                </Form>
            )}

            {didSubmitMessage && (
                <StatusMessage
                    title={getString("yay")}
                    faIcon={`fa-solid fa-check`}
                    type={`success`}
                    message={getString("message_sent_success")}
                />
            )}
        </Article>
    );
}

export default ArticleContactForm;
