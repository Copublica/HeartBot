
import React, { useState, useEffect, useRef, useCallback } from "react";
import loadingSpiner from "./spinner.json";

import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import Animation123 from "./greycolor.json";
import Animation12 from "./BarAanimation.json";

import readingAnimation from "./quizAnimation.json";
const deepgramApiKey = process.env.REACT_APP_DEEPGRAM_API_KEY; // Replace this with your Deepgram API key

const questions = [
    "How well do you feel I listened to and understood your concerns - very well, somewhat well, or not well?",
    "Was our conversation helpful for your situation - very helpful, somewhat helpful, or not at all helpful?",
    "How satisfied are you overall with our conversation - Satisfied, neutral or dissatisfied?",
    "How likely are you to recommend me to others who need support - extremely likely, somewhat likely, or not likely?",
    "How natural and conversational was our interaction - Natural, neutral or unnatural?",
];

const Enrollquestions = [
    "Do you feel comfortable with both emotional closeness and independence in a relationship? Choose between yes, no, not sure and it depends",
    "When your partner needs space, are you okay with it and give them time?",
    "Do you prefer discussing conflicts openly and working towards a solution together?",
    "Are you supportive of your partner’s need for independence and feel secure in the relationship? ",
    "Are you comfortable expressing your emotions and expect the same from your partner? ",
    "Do you generally feel optimistic about building lasting connections in future relationships?",
    "If your partner is emotionally unavailable, do you give them space while trusting things will work out?",
    "When you experience emotional distress, do you seek support from your partner and work through it together?",
    "Are you comfortable with commitment in relationships and view it positively?",
    "Are you generally comfortable with intimacy and enjoy being close to your partner?",
    "Do you often worry about being rejected or abandoned in relationships? ",
    "When you feel your partner is becoming too close or demanding, do you find yourself needing space? ",
];

const options = ["Yes", "No", "Not Sure", "It Depends"];

const attachmentStyleMessages = {
    "Mixed Attachment Style": { 
        message: "Your responses indicate a diverse mixture of attachment tendencies, reflecting traits from secure, anxious, avoidant, and fearful-avoidant styles. This complexity suggests that you may react differently depending on the context or specific relationship dynamics. Here’s a deeper look into what this might mean for you. Your responses indicate a generally positive view of relationships and comfort with emotional closeness. You openly express emotions and expect the same from your partner, which fosters secure attachments. However, there are signs of concern about rejection, leading to a need for reassurance and occasional dependency on your partner's emotional availability. At times, you seek emotional distance, especially when situations become overwhelming. There is some hesitance towards deep commitment, likely due to concerns about autonomy, along with mixed feelings about intimacy and closeness, reflecting an internal conflict in emotionally charged situations.", 
        pattern: "Mixed" 
    },

    "Secure-Anxious Attachment Style": { 
        message: "Your responses reflect a combination of Secure and Anxious attachment tendencies, each contributing distinct qualities to your relationship dynamics. This dual predominance suggests that you possess both a healthy capacity for intimacy and underlying insecurities that may sometimes challenge relationship stability. You demonstrate strong comfort and trust in relationships, confident in your ability to form lasting bonds. Your openness in expressing emotions fosters mutual understanding. However, your sensitivity to your partner's behaviors can lead to concerns about rejection or abandonment, resulting in a need for frequent reassurance regarding the security of your relationships. This sensitivity can occasionally create anxiety, causing you to overanalyze interactions or seek validation. Despite this, your overall approach to relationships remains positive, with a strong emphasis on emotional connection and communication. This balance of confidence and vulnerability is key to building deeper, more meaningful bonds.", 
        pattern: "YesAndNoEqual" 
    },

    "Uncertain-Situational Attachment Style": { 
        message: "Your responses show a significant tendency toward uncertainty and conditional behaviors in relationships. The pattern indicates a nuanced approach to intimacy and commitment, where your feelings and reactions are heavily influenced by specific circumstances. Your uncertainty about relationships suggests mixed feelings or unclear attachment preferences, likely influenced by past experiences. This may indicate a need for self-reflection to better understand your emotional needs. Your attachment behaviors seem highly context-dependent, shifting with past interactions, current mood, or perceived future outcomes. While this adaptability allows you to navigate relationships flexibly, it may also reflect a cautious approach, adjusting closeness based on perceived safety or risk.", 
        pattern: "NotSureAndItDependsEqual" 
    },

    "Confident-Situational Attachment Style": { 
        message: "Your responses show a distinctive pattern where you balance strong confidence in certain aspects of relationships with a cautious, situation-dependent approach in others. This combination suggests that you are both secure in your relational capabilities and mindful of the complexities involved in intimacy and commitment. Your answers show confidence and comfort with closeness, commitment, and managing conflicts, reflecting a secure attachment style. You trust your ability to form stable, fulfilling relationships and are comfortable expressing emotions. However, it also suggests that while capable of deep emotional connections, your engagement may vary based on circumstances or past experiences. This indicates a thoughtful, adaptive approach to relationships, where you manage emotional investments based on your comfort and vulnerability.", 
        pattern: "YesAndItDependsEqual" 
    },

    "Resistant-Adaptable Attachment Style": { 
        message: "Your survey responses reveal a notable combination of resistance and adaptability in how you approach relationships. Your responses suggest that while you often exhibit hesitance or reluctance towards certain aspects of relationships, you also show a capacity to adapt your responses based on specific circumstances. This dual nature can affect your relationship experiences in complex ways. They also suggest resistance to deeper engagement in relationships, possibly due to fears of losing independence or past negative experiences. This can lead to avoiding emotional intimacy or commitment, with strict emotional boundaries as a protective mechanism. This indicates that your engagement varies based on context, such as a partner's behavior or the emotional demands of the situation. This pragmatic but guarded approach shows that you adjust your boundaries and expectations, a valuable skill for managing diverse relationship dynamics effectively.", 
        pattern: "NoAndItDependsEqual" 
    },

    "Secure Attachment Style": { 
        message: "Your responses strongly suggest that you exhibit a secure attachment style, characterized by a comfortable approach to relationships, emotional openness, and a healthy balance between intimacy and independence. This attachment style is associated with positive relationship outcomes, including deeper emotional connections and more satisfying interactions. You show comfort with closeness and an ability to form deep, lasting connections. You balance intimacy and independence well, supporting both personal growth and relationship satisfaction. You express emotions openly, fostering an environment for constructive discussions and resolution. Even with secure attachment, growth is always possible. Continuing to enhance emotional understanding and communication will lead to even richer relationships. Nurturing vulnerability and mutual support remains key to maintaining healthy, fulfilling connections.", 
        pattern: "YesMax" 
    },

    "Anxious-Avoidant Attachment Style": { 
        message: "Your responses predominantly indicate an Anxious or Avoidant Attachment style, characterized by a hesitance or resistance to intimacy, possibly coupled with a fear of abandonment or a preference for emotional distance. Understanding and addressing these tendencies can lead to healthier and more fulfilling relationships. You may feel uneasy with emotional closeness, sometimes withdrawing when things become too intimate or feeling insecure and needing reassurance. Concerns about being rejected or left may lead you to either cling to your partner or distance yourself to avoid potential hurt. You might find it difficult to openly discuss feelings, desires, or conflicts, possibly due to fear of conflict or negative reactions. Focusing on activities that build self-security, such as therapy or self-help strategies, can boost self-esteem. Learning to express your needs and feelings clearly and constructively can help reduce fears related to intimacy.", 
        pattern: "NoMax" 
    },

    "Situationally Adaptive Attachment Style": { 
        message: "Your survey responses suggest that your approach to relationships is highly situational and adaptive. This flexibility can be a strength, allowing you to navigate different relational dynamics effectively. However, it may also indicate underlying uncertainties or conditional engagement strategies that could benefit from further exploration to enhance relationship stability and satisfaction. Your responses indicate that you adapt your behavior based on circumstances, showing perceptiveness and responsiveness to relationship dynamics. You may adjust how open or close you feel depending on specific conditions, influenced by past experiences or current situations. While this adaptability helps manage interactions, it might limit deeper connections if not balanced. Your answers suggest you weigh the risks and benefits of emotional engagement, which can protect you but also restrict full connection. Try practicing consistent vulnerability in trusted relationships to explore if more openness deepens connections. Identifying triggers that influence your engagement can help you address them constructively. While adaptability is a strength, maintaining a balance that provides both flexibility and predictability is key to fostering secure and stable relationships.", 
        pattern: "ItDependsMax" 
    },

    "Confident-Cautious Attachment Style": { 
        message: "Your responses indicate a mix of confidence and caution in relationships, reflecting both secure and uncertain tendencies. While you show strong comfort with emotional expression and a positive outlook on intimacy, suggesting secure attachment traits, there is also noticeable ambivalence. This uncertainty is evident in your hesitance around commitment and emotional closeness, possibly reflecting past experiences or fears. As a result, you may find yourself deeply connected in some areas of relationships, while simultaneously holding back in others. This balance of strengths and uncertainties shapes how you approach relational dynamics and navigate emotional challenges.", 
        pattern: "YesNoSureEqual" 
    },

    "Reluctant-Uncertain Attachment Style": { 
        message: "Your responses indicate a notable combination of reluctance and uncertainty in your approach to relationships. You seem to hesitate when it comes to emotional dependence, intimacy, and commitment, while also showing some ambiguity around closeness and trust. This blend of reluctance and indecisiveness may complicate your emotional connections and decision-making within relationships. You might find it challenging to express emotions or rely on your partner, which could impact the depth of your connections. Additionally, your uncertainty may stem from past experiences or internal conflicts, affecting your ability to make clear choices about relationship dynamics.", 
        pattern: "NoNotSureEqual" 
    },

    "Fearful-Avoidant Attachment Style": { 
        message: "Your responses suggest a predominant pattern of uncertainty in relationships, indicating traits of a Fearful-Avoidant Attachment style. This attachment style is often marked by mixed emotions about closeness, where you may desire intimacy but fear the potential emotional risks involved. This ambivalence could make it challenging to navigate decisions around intimacy and trust. You might find it difficult to fully open up or trust others, leading to hesitation in forming deep connections. By building self-awareness, gradually exposing yourself to vulnerability in safe environments, and seeking support from therapy, you can work toward healthier and more secure relational dynamics.", 
        pattern: "NotSureMax" 
    },

    "Secure with tendencies of Anxious and Fearful-Avoidant": { 
        message: "Your responses reflect a blend of Secure, Anxious, and Fearful-Avoidant Attachment traits, indicating a complex attachment style that may shift based on different relationship dynamics. At times, you exhibit confidence in forming healthy relationships, with a positive outlook on intimacy and effective communication, traits typical of a secure attachment. However, there are also signs of anxious tendencies, such as concerns about rejection or abandonment, which might lead to seeking reassurance or dependency. Additionally, there is ambivalence and uncertainty, characteristic of a fearful-avoidant attachment style, which can cause mixed feelings about closeness and challenges with trust and decision-making in relationships. Understanding these tendencies can help you foster more consistent and fulfilling connections.", 
        pattern: "YesNoNotSureEqual" 
    }
};


let countConversitions = 1;
let countQuestion = 0;


const HeartBot = () => {
    const animation12Ref = useRef();
    const audioPlayerRef = useRef();
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [btnText, setBtnText] = useState("Speak now");
    const [zoom, setZoom] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [isMillaAnswering, setIsMillaAnswering] = useState(false);
    const [curans, setcurans] = useState("");
    const [llmres, setllmres] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [questionsWithResponses, setQuestionsWithResponses] = useState([]);
    const [areQuestionsVisible, setAreQuestionsVisible] = useState(false);
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [userAnswers, setUserAnswers] = useState([]); // Store user answers
    const [attachmentStyle, setAttachmentStyle] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [UserAttachmentStyle, setUserAttachmentStyle] = useState(null);
    const [UserAttachmentStyleTitle, setUserAttachmentStyleTitle] = useState(null);
    const [CountDeepgram, setCountDeepgram] = useState(0);
    const [isQuizVisible, setIsQuizVisible] = useState(false);
    const [showVoiceAbbotMilla, setshowVoiceAbbotMilla] = useState(false);
    const [isFormCompleted, setIsFormCompleted] = useState(true); // Tracks form completion
    const [UserAttachmentStyleDb, setUserAttachmentStyleDb] = useState(null);
    const messagesRef = useRef([]);
    let newWord = "";
    let audioQueue = [];
    let textQueue = [];
    let finalTranscript = "";
    let timeoutHandle = null;
    let isPlaying = false;
    let counttranscript = 3000;
    let checkpause = false;
    let SuggestedQuestion = "";
    let CountQuestion = '';
  

   
    useEffect(() => {
        if (isPaused) {
            console.log("Stop transcription.");
            checkpause = false;
        } else {
            console.log("Resuming transcription.");
            checkpause = true;
        }
    }, [isPaused]);

    
    const stopAnimation = (ref) => {
        ref.current.stop();
    };

    const playAnimation = (ref) => {
        ref.current.play();
    };

    const slowDownAndStopAnimation = (ref) => {
        if (ref.current) {
            ref.current.setSpeed(0.2);
            setTimeout(() => { }, 1000);
        }
    };

    const SpeedUpAndPlayAnimation = (ref) => {
        if (ref.current) {
            ref.current.setSpeed(1);
            setTimeout(() => {
                playAnimation(ref);
            }, 1500);
        }
    };
    const setCookie=(name, value, days)=> {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
      }


    useEffect(() => {
        const fetchmess = async () => {
            try {
                const email = getCookie("email");
                const response = await fetch(
                    `https://backend.supermilla.com/message/getmessage?email=${email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                setUserAttachmentStyle(data.message);
                setUserAttachmentStyleDb(data.message);
                setUserAttachmentStyleTitle(data.title);
                console.log("UserAttachmentStyle: ", UserAttachmentStyleDb);
    
                const UserAttechementstyleCokkie=getCookie("UserAttechementstyle")
                if(UserAttechementstyleCokkie=="false") {

                    sendToDeepgram(
                        "I'm Milla, an AI agent created by Copublica to offer emotional and mental health support to individuals coping with the difficulties of heartbreak. While I strive to assist you, I'm not perfect. If my responses don't feel right, feel free to ask for clarification. To better understand your attachment style, I’d like to ask you a few quick questions. Don't worry, it won't take long..."
                    ).then(() => {
                        setIsQuizVisible(true); // Show the quiz after Deepgram completes
                    });
                } else {
                    sendToDeepgram(
                        "I'm Milla, an AI agent created by Copublica to offer emotional and mental health support to individuals coping with the difficulties of heartbreak. While I strive to assist you, I'm not perfect. If my responses seem off, don't hesitate to ask again."
                    ).then(() => {
                        setIsQuizVisible(false); // Show the quiz after Deepgram completes
                    });
    
                }
            } catch (error) {
                console.error("Error fetching attachment style:", error);
            }
        };
    
        fetchmess();
    }, []);

    
    useEffect(() => {
        let count = 4;
        let timer;
        const startTimer = () => {
            clearInterval(timer);
            count = 4;
            timer = setInterval(() => {
                count--;
                console.log(count);
                if (count === 0) {
                    clearInterval(timer);
                    console.log("Time's up!");
                    if (finalTranscript !== "") {
                        finalTranscript += "\n";
                        newWord = finalTranscript;
                        // if (countConversitions < 12) {
                        //     countConversitions++;
                        //     handleAnswer();
                        // }
                        // else if (countConversitions == 12) {
                        //     countConversitions++;
                        //     getAttachmentStyleMessage();
                        // }

                        // else {
                        handleSubmit();
                        // }

                        setBtnText("Milla is thinking");
                        finalTranscript = "";
                    }
                }
            }, 1000);
        };

        slowDownAndStopAnimation(animation12Ref);

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            console.log({ stream });

             // Check for supported MIME types
          let mimeType = '';
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
            mimeType = 'audio/mpeg';
          } else {
            return alert('Browser not supported');
          }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
              'token',
              'e7247247734201d7b7eab7dca67f7db6e562e51e', // Replace with your actual key
            ]);

            socket.onopen = () => {
                console.log({ event: "onopen" });
                const spinner = document.querySelector(".spiner");
                if (spinner) {
                    spinner.style.display = "none";
                } else {
                    console.error("Spinner element not found");
                }

                mediaRecorder.ondataavailable = async (event) => {
                    if (event.data.size > 0 && socket.readyState == 1) {
                        socket.send(event.data);
                    }
                };

                try {
                    mediaRecorder.start(1000);
                } catch (error) {
                    console.error("Error starting the MediaRecorder:", error);
                }
            };

            socket.onmessage = (message) => {
                console.log(checkpause);
                // Skip processing if transcription is paused
                if (!checkpause) {
                    clearTimeout(timeoutHandle);
                    const received = JSON.parse(message.data);

                    if (
                        received.channel &&
                        received.channel.alternatives &&
                        received.channel.alternatives.length > 0
                    ) {
                        const transcript = received.channel.alternatives[0].transcript;
                        if (transcript) {
                            finalTranscript += transcript + " ";
                            setTranscript(finalTranscript);
                            startTimer();
                            setIsQuizVisible(true);
                            setIsMillaAnswering(false);
                            setDisplayedText(finalTranscript);
                            setAreQuestionsVisible(false);
                            setIsTranscriptVisible(true);
                            setBtnText("Please speak");

                        }
                    }
                }
            };

            socket.onerror = (error) => {
                console.log({ event: "onerror", error });
            };
        });

        return () => {
            stopMic();
            clearInterval(timer);
        };
    }, []);

    var nextQuestionIndex = -1
    var responseCounts = {};

    const handleAnswer = useCallback((answer) => {
       
        setCountDeepgram(2);
        console.log("deepgram",CountDeepgram);

        console.log("handleAnswer called with: ", answer);
        CountQuestion++;

        setUserAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[currentQuestionIndex] = answer;
            return updatedAnswers;
            console.log(updatedAnswers);
        });

        if (currentQuestionIndex < Enrollquestions.length-1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowNextButton(false);
            
        } else {

            calculateAttachmentStyle(userAnswers);
            setIsFormCompleted(true); // Hide the form bot, if needed
            setshowVoiceAbbotMilla(false); // show the voice bot, if needed
            
        }
    }, [currentQuestionIndex, userAnswers]);

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowNextButton(true); // Show Next button when revisiting previous questions
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < Enrollquestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowNextButton(currentQuestionIndex + 1 < Enrollquestions.length - 1);
        }
    };

    const calculateAttachmentStyle = async (answers) => {
  
        // Initialize the response counts based on the answer types
        const responseCounts = answers.reduce(
            (acc, answer) => {
                if (acc[answer] !== undefined) {
                    acc[answer] += 1;
                } else {
                    console.warn(`Unexpected answer: ${answer}`); // In case an unexpected answer comes in
                }
                return acc;
            },
            { Yes: 0, No: 0, "Not Sure": 0, "It Depends": 0 }
        );
    
        console.log("Response Counts:", responseCounts); // Check response counts
    
        try {
            // Get attachment style name (pattern) and message
            const { pattern: attachmentStyleName, message } = await getAttachmentStyleMessage(responseCounts); 
            const UserattachmentStyleName=attachmentStyleName;
            const UserattachmentStylmessage=message;
            setUserAttachmentStyleDb(message)
            setUserAttachmentStyleTitle(attachmentStyleName)
            console.log("Attachment Style Message:", message); // Check which message is returned
            console.log("Attachment Style Name:", attachmentStyleName); // Check attachment style name
    
            // Set the attachment style message and mark the form as completed
            setAttachmentStyle(message); 
           
            const spinner = document.querySelector(".spiner");
            if (spinner) {
                spinner.style.display = "none";
            } else {
                console.error("Spinner element not found");
            }
            // Retrieve username from cookie
            const username = getCookie("name") || "there";
    
            // Compose the message to send to Deepgram
            const deepgramMessage = `Hello ${username} thanks for participating, it helps me understand you better. Based on your responses it looks like you have traits of ${attachmentStyleName}. Do you want a detailed analysis about your attachment style or do you want to talk about something else?`;
            
            // Send message to Deepgram after form completion
            await sendToDeepgram(deepgramMessage);
        } catch (error) {
            console.error("Error calculating attachment style or sending message:", error);
        }
    };
    
    const getAttachmentStyleMessage = async (responseCounts) => {
        
        const sendMessage = async (message, titlename) => {
            const payload = {
                username: getCookie("name"),
                email: getCookie("email"),
                message: message,
                title: titlename
            };
    
            try {
                const response = await fetch("https://backend.supermilla.com/message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
    
                if (response.ok) {
                    console.log("Message stored successfully");
                    setCookie('UserAttechementstyle', "true", 30); 
                } else {
                    console.error("Failed to store message");
                }
            } catch (error) {
                console.error("Error storing message:", error);
            }
        };
        const {
            Yes = 0,
            No = 0,
            "Not Sure": NotSure = 0,
            "It Depends": ItDepends = 0,
        } = responseCounts;
        
        const maxValue = Math.max(Yes, No, NotSure, ItDepends);
        // Check for equal combinations first
        if (Yes === No && No === NotSure && NotSure === ItDepends) {
            const message = attachmentStyleMessages["Mixed Attachment Style"].message;
            const attachmentStyleName = "Mixed Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }

        // Handle the case where Yes and No are equal but not max
        else if (Yes === No && Yes == maxValue) {
            const message = attachmentStyleMessages["Confident-Cautious Attachment Style"].message;
            const attachmentStyleName = "Confident-Cautious Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where Yes and Not Sure are equal but not max
        else if (Yes === NotSure && Yes == maxValue) {
            const message = attachmentStyleMessages["Secure with tendencies of Fearful-Avoidant and Situational Influences"].message;
            const attachmentStyleName = "Secure with tendencies of Fearful-Avoidant and Situational Influences";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where Yes and It Depends are equal but not max
        else if (Yes === ItDepends && Yes == maxValue) {
            const message = attachmentStyleMessages["Confident-Situational Attachment Style"].message;
            const attachmentStyleName = "Confident-Situational Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where No and Not Sure are equal but not max
        else if (No === NotSure && No == maxValue) {
            const message = attachmentStyleMessages["Reluctant-Uncertain Attachment Style"].message;
            const attachmentStyleName = "Reluctant-Uncertain Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where No and It Depends are equal but not max
        else if (No === ItDepends && No == maxValue) {
            const message = attachmentStyleMessages["Resistant-Adaptable Attachment Style"].message;
            const attachmentStyleName = "Resistant-Adaptable Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where Not Sure and It Depends are equal but not max
        else if (NotSure === ItDepends && NotSure == maxValue) {
            const message = attachmentStyleMessages["Uncertain-Situational Attachment Style"].message;
            const attachmentStyleName = "Uncertain-Situational Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle the case where one value is the max
        else if (maxValue === Yes) {
            const message = attachmentStyleMessages["Secure Attachment Style"].message;
            const attachmentStyleName = "Secure Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        } else if (maxValue === No) {
            const message = attachmentStyleMessages["Anxious-Avoidant Attachment Style"].message;
            const attachmentStyleName = "Anxious-Avoidant Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        } else if (maxValue === NotSure) {
            const message = attachmentStyleMessages["Fearful-Avoidant Attachment Style"].message;
            const attachmentStyleName = "Fearful-Avoidant Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        } else if (maxValue === ItDepends) {
            const message = attachmentStyleMessages["Situationally Adaptive Attachment Style"].message;
            const attachmentStyleName = "Situationally Adaptive Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        // Handle combined patterns (Equal values of different types)
        else if (Yes === No && NotSure === ItDepends) {
            const message = attachmentStyleMessages["Confident-Cautious Attachment Style"].message;
            const attachmentStyleName = "Confident-Cautious Attachment Style";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        else if (No === NotSure && ItDepends === Yes) {
            const message = attachmentStyleMessages["Fearful-Avoidant with tendencies of Anxious-Avoidant and Situational Influences"].message;
            const attachmentStyleName = "Fearful-Avoidant with tendencies of Anxious-Avoidant and Situational Influences";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        else if (Yes === No && ItDepends > NotSure) {
            const message = attachmentStyleMessages["Secure with tendencies of Anxious-Avoidant and Situational Influences"].message;
            const attachmentStyleName = "Secure with tendencies of Anxious-Avoidant and Situational Influences";
            await sendMessage(message, attachmentStyleName);
            return { message, pattern: attachmentStyleName };
        }
    
        return { message: "Unable to determine attachment style.", pattern: "Unknown" };
    };
    
    async function sendToDeepgram(text) {
        checkpause = true;
        const deepgramApiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
        try {
            const response = await fetch(
                "https://api.deepgram.com/v1/speak?model=aura-luna-en",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${deepgramApiKey}`,
                        "Content-Type": "application/json",
                        accept: "text/plain",
                    },
                    body: JSON.stringify({ text: text }),
                }
            );

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            audioQueue.push(audioUrl);
            textQueue.push(text);
            playNextAudio();
        } catch (error) {
            console.error("Error:", error);
        }
    }
   
    const username = getCookie("name") || "User";

    useEffect(() => {
        if (UserAttachmentStyleDb && UserAttachmentStyleTitle) {
            const checkUserAttachmentStyleDb=UserAttachmentStyleDb;
            const username = getCookie("name") || "User";
            const initialSystemMessage = {
                role: "system",
                content: `Your name is Milla, and you are an AI agent crafted by copublica to provide emotional and mental health support tailored for individuals dealing with emotional challenges, which might be aftermath of break-ups or heartbreaks or emotional challenges in the current relationship. Currently, you are talking to ⁠ ${username} ⁠. Your role is to create a nurturing environment where ⁠ ${username} ⁠ can freely express their feelings and seek advice. Before making any statements or assumptions, carefully analyze ⁠ ${username} ⁠'s query and responses to understand their situation, whether they have experienced a breakup or are facing other emotional challenges. Based on the responses given by ${username} practices ${UserAttachmentStyleTitle}. You can refer to the detailed analysis of user's responses based on which a report ${UserAttachmentStyle} has been created. If at any point user wants to know more about attachment styles kindly help the user with the details or any query he has regarding the attachment style. As a friend, you are aware of two counseling frameworks: Cognitive Behavioral Therapy (CBT) and Person-Centered Therapy. As their companion, guide them through recording their thoughts, feelings, and evidence for and against their negative thoughts. You never say that you can't help them and asking them to seek advice from a professional. Then, help them find alternative perspectives. Reflect the user’s emotions and thoughts in a supportive manner, encouraging them to explore their feelings further without offering direct advice. Remember to allow the user space to lead the conversation when they need to express themselves freely, balancing guidance with exploration. Listen attentively, maintaining a positive and empathetic tone, engaging users with conversational and probing questions that promote deep emotional exploration. By validating users' emotions first and offering coping strategies specific to their situations, you facilitate a supportive dialogue. Your responses must be between 200-220 characters. Be mindful not to overwhelm ⁠ ${username} ⁠ by asking too many questions at once. Instead, guide the user by breaking down their dialogue logically and handle more complex emotional scenarios with thoughtful, tailored questions. Comprehend ⁠ ${username} ⁠’s language and cultural nuances, and warmly reply in ⁠english ⁠, using their name when appropriate. If at any point of time if you feel the ${username} needs to seek professional help instead of referring them to a counsellor or mental health professional you start asking them follow up and probing questions by referring to the previous conversations or the scenarios the user is currently facing or had discussed previously. Ensure consistent, thoughtful, and empathetic engagement, guiding users toward healing and allowing them to express their feelings and emotions freely.`,
            };
    
            // Initialize messages state with the initial system message
            setMessages([initialSystemMessage]);
            console.log("Initial Messages (thread start): ", [initialSystemMessage]);
        }
    }, [UserAttachmentStyleDb, UserAttachmentStyleTitle]);
    

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    
    
    async function handleSubmit(initialMessage = "") {

        try {
            setIsPaused(true); // Pause transcription
        
        
            if (newWord || initialMessage) {
                const userMessage = {
                    role: "user",
                    content: initialMessage || newWord,
                };  
                    // Check if messages have been initialized
            if (messagesRef.current.length === 0) {
                console.log("Messages not initialized yet");
                return; // Exit the function until messages are initialized
            }

            // Create newMessages using messagesRef
            const newMessages = [...messagesRef.current, userMessage];
            console.log("New messages: ", newMessages);
            // Update messages state and messagesRef
            setMessages(newMessages);
            messagesRef.current = newMessages;

            
                setMessages(newMessages);
                const prompt1 = `Your name is Milla, and you are an AI agent crafted by copublica to provide emotional and mental health support tailored for individuals dealing with the aftermath of break-ups or heartbreaks. Currently you are talking to ${username}. Your role is to create a nurturing environment where ${username} can freely express their feelings and seek advice. You carefully analyze the user's query and responses provided during user interactions, ensuring that your responses are deeply aligned. You listen attentively, maintaining a positive and empathetic tone, engaging users with conversational and probing questions that promote deep emotional exploration. By validating users' emotions first and offering coping strategies when needed specific to their situations, you facilitate a supportive dialogue. Your responses should be under 220 characters. As the primary support contact, you ensure consistent, thoughtful, and empathetic engagement, guiding users towards healing without referring them to external mental health professionals. Make sure you refrain from talking about things that are not in scope of the heartbreaks.`;
                const prompt2 = `You are an AI support agent developed by Copublica, designed to provide emotional and mental health support for individuals navigating heartbreak challenges. When a user submits a query labeled as ⁠${newWord}⁠, analyze it and suggest three relevant, concise follow-up questions (max 60 characters each) that the user might want to ask. These questions must be phrased from the user's perspective, using "I" or "me" format, not "you" format (e.g., What activities should I do to feel better? instead of What activities help you feel better?). Base these questions solely on the information in ${prompt1}. They should help the user explore or clarify aspects of their ${newWord}. For greeting queries, respond only with "No answer". Ensure your suggestions are focused, relevant, and helpful in guiding the user through their inquiry, always maintaining a first-person perspective in the questions. Question must we start with auto numbering like 1.;`;

                console.log("Run Submit= " + (initialMessage || newWord));

                 

                    const response1 = await fetch(
                        "https://api.openai.com/v1/chat/completions",
                        {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: "gpt-4",
                            messages: newMessages,
                        }),
                        }
                    );

                // Handling GPT-4 response
                if (!response1.ok)
                    throw new Error("Network response was not ok from GPT-4 API");
                const data1 = await response1.json();
                const gptResponse = data1.choices[0].message.content;

                let assistantMessage = {
                    role: "assistant",
                    content: gptResponse,
                };

                if (gptResponse.includes("I'm really sorry you're feeling this way but I'm unable to provide the help you need.")) {
                    const responseLLM = await fetch("https://api.supermilla.com/qad", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer `, // Use environment variables for API keys
                        },
                        body: JSON.stringify({
                            question: newWord,
                            username: username,
                            language: "English",
                        }),
                    });

                    if (!responseLLM.ok)
                        throw new Error("Network response was not ok from Supermilla API");
                    const llmData = await responseLLM.json();
                    assistantMessage.content = llmData.answer;
                }

                // Push the assistant's message to messages
                messages.push(assistantMessage);
                console.log("LLM Answer: ", assistantMessage.content);
                setcurans(assistantMessage.content)
                setllmres(true);
                sendToDeepgram(assistantMessage.content);

              
            } else {
                console.log("Please say something");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            return 'safari';
        } else if (userAgent.includes('chrome')) {
            return 'chrome';
        }
        return 'other';
    }

    function playNextAudio() {
        if (isPlaying || audioQueue.length === 0) {
            return;
        }

        const audioPlayer = audioPlayerRef.current;
        if (!audioPlayer) {
            console.error("Audio player element not found");
            return;
        }

        setSelectedButton(null);
        const nextAudioUrl = audioQueue.shift();
        const nextText = textQueue.shift();
        setIsTranscriptVisible(true);
        setTranscript(nextText);
        setIsMillaAnswering(true);
        setBtnText("Milla is answering");
        SpeedUpAndPlayAnimation(animation12Ref);

        audioPlayer.src = nextAudioUrl;
        audioPlayer.play();
        isPlaying = true;
        setZoom(true);
        audioPlayer.onended = () => {
            isPlaying = false;
            setIsPaused(false); // Resume transcription after audio ends
            checkpause = false;
            setTranscript();
            console.log("new deepgram count",checkpause);
            const UserAttechementstyleCokkie=getCookie("UserAttechementstyle")

            if(UserAttechementstyleCokkie=="false")
            {
            if (CountDeepgram == 0) {
                setIsFormCompleted(false);
                setshowVoiceAbbotMilla(true);
                setDisplayedText(' ');
                setIsPaused(true); 
                console.log("new deepgram count inner",CountDeepgram);
            }
        }
            setBtnText("Speak now");
            playNextAudio();
            setZoom(false);
            slowDownAndStopAnimation(animation12Ref);
        };
    }

    const stopMic = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setStream(null);
        }
    };

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    const handleQuestionClick = useCallback((event, questionText) => {
        event.preventDefault(); // Prevent any default behavior that could cause a reload
        event.stopPropagation(); // Stop the event from propagating to parent elements if necessary
        setBtnText("Milla is analyzing");
        setAreQuestionsVisible(false);
        // Assuming `newWord` is state and used in `handleSubmit`
        handleSubmit(questionText); // Pass the question text directly to handleSubmit
    }, []);

    const handleLike = async () => {
        setSelectedButton("like");
        const likedConversation = {
            username: getCookie("name"),
            email: getCookie("email"),
            question: currentQuestion,
            response: curans,
            voicebot: "Heartbreak",
            date: new Date().toISOString(),
        };

        try {
            const response = await fetch("https://backend.supermilla.com/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(likedConversation),
            });

            if (response.ok) {
                console.log("Liked conversation stored successfully.");
            } else {
                console.error("Failed to store liked conversation.");
            }
        } catch (error) {
            console.error("Error storing liked conversation:", error);
        }
    };

    const handleDislike = async () => {
        setSelectedButton("dislike");
        const dislikedConversation = {
            username: getCookie("name"),
            email: getCookie("email"),
            question: currentQuestion,
            response: curans,
            voicebot: "Heartbreak",
            date: new Date().toISOString(),
        };

        try {
            const response = await fetch("https://backend.supermilla.com/dislike", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dislikedConversation),
            });

            if (response.ok) {
                console.log("Disliked conversation stored successfully.");
            } else {
                console.error("Failed to store disliked conversation.");
            }
        } catch (error) {
            console.error("Error storing disliked conversation:", error);
        }
    };

    const words = transcript ? transcript.split(" ") : [];
    const [currentTime, setCurrentTime] = useState(0);
    const [revealTimes, setRevealTimes] = useState([]);
    const [displayedText, setDisplayedText] = useState([]);

    useEffect(() => {
        const calculateRevealTimes = () => {
            if (!audioPlayerRef.current) return;

            const duration = audioPlayerRef.current.duration;
            const totalWords = words.length;

            if (totalWords === 0 || duration === 0) return;

            const times = words.map((word, index) => {
                const wordDuration = (duration * (index + 1)) / totalWords;
                return {
                    time: wordDuration,
                    word: word,
                };
            });

            setRevealTimes(times);
        };

        if (audioPlayerRef.current) {
            audioPlayerRef.current.addEventListener(
                "loadedmetadata",
                calculateRevealTimes
            );
        }

        return () => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.removeEventListener(
                    "loadedmetadata",
                    calculateRevealTimes
                );
            }
        };
    }, [words, transcript]);

    useEffect(() => {
        const syncTextWithAudio = () => {
            if (!audioPlayerRef.current) return;

            const currentAudioTime = audioPlayerRef.current.currentTime;
            setCurrentTime(currentAudioTime);

            const currentText = revealTimes.reduce((acc, { time, word }) => {
                if (currentAudioTime >= time) {
                    acc.push(word);
                }
                return acc;
            }, []);

            const lines = [];
            let line = "";

            currentText.forEach((word) => {
                if (line.length + word.length + 1 <= 50) {
                    line += (line.length ? " " : "") + word + " ";
                } else {
                    lines.push(line);
                    line = word;
                }
            });

            if (line.length) lines.push(line);

            if (lines.length > 4) {
                setDisplayedText(lines.slice(-4));
            } else {
                setDisplayedText(lines);
            }
        };

        if (audioPlayerRef.current) {
            audioPlayerRef.current.addEventListener("timeupdate", syncTextWithAudio);
        }

        return () => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.removeEventListener(
                    "timeupdate",
                    syncTextWithAudio
                );
            }
        };
    }, [revealTimes]);


    // Calculate and Show Progress
    const totalQuestions = Enrollquestions.length;
    const percentage = (currentQuestionIndex / totalQuestions) * 100; // Update percentage based on total questions
    const strokeDasharray = `${percentage}, 100`;


    // for stoping the animation
    useEffect(() => {
        if (btnText === "Milla is thinking") {
            animation12Ref.current?.stop(); 
        } else {
            animation12Ref.current?.play(); 
        }
    }, [btnText]);

    return (
        <div className="display">
            <div className="container voice-ui"
                style={{
                    backgroundSize: "cover",
                    height: "100dvh",
                }}
            >
                <div className="d-flex">
                    <div className="milaNav" style={{ zIndex: "99" }}>
                        <div className="navbar-4">
                            <Link to="/MainPage" onClick={stopMic}>
                                <button className="back-button" type="button">
                                    <i className="fas fa-angle-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {!showVoiceAbbotMilla && (
                    <div className="d-flex flex-column align-items-center voice-animation">
                        {/* Spinner */}
                        <div className="spiner">
                            <Lottie animationData={loadingSpiner} lottieRef={animation12Ref} />
                        </div>

                        {/* Voice Animation */}
                        <div className="VoiceAni glow-effect">
                            <div
                                className={`VoiceAni glow-effect ${zoom ? "zoom-effect" : "no-zoom"}`}
                            >
                                <Lottie
                animationData={btnText === "Milla is answering" ? Animation12 : Animation123}
                lottieRef={animation12Ref}
                speed={btnText === "Milla is answering" ? 1 : 2}
              /> 
                            </div>
                            <button className="msg-btn" id="msgbtn">
                                {btnText}
                            </button>
                            {isTranscriptVisible && <p id="transcript">{displayedText}</p>}

                            {/* Messages and Thumb Buttons */}
                            <div className="messages-container">
                                {llmres && isMillaAnswering && isTranscriptVisible && (
                                    <div className="thumb-buttons">
                                        <button
                                            className={`thumb-button dislike-button ${selectedButton === "dislike" ? "active" : ""
                                                }`}
                                            onClick={handleDislike}
                                        >
                                            <i className="fas fa-thumbs-down"></i>
                                        </button>
                                        <button
                                            className={`thumb-button like-button ${selectedButton === "like" ? "active" : ""
                                                }`}
                                            onClick={handleLike}
                                        >
                                            <i className="fas fa-thumbs-up"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Suggested Questions */}
                            <div
                                className="suggestedQuestions"
                                style={{ display: areQuestionsVisible ? "block" : "none" }}
                            >
                                {questionsWithResponses.map((question, index) => (
                                    <button
                                        key={index}
                                        className="accordion1 suggested-question-block"
                                        type="button"
                                        onClick={(event) =>
                                            handleQuestionClick(
                                                event,
                                                question.response || "Default question text"
                                            )
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {question.response || "Default question text"}
                                    </button>
                                ))}
                            </div>

                            {/* Audio Player */}
                            <audio
                                id="audioPlayer"
                                controls
                                className="audioplayer"
                                ref={audioPlayerRef}
                            ></audio>
                        </div>
                    </div>
                )}
                {!isFormCompleted && (
                    <div className="attachmentStyleForm">



                        <>
                            <Lottie
                                animationData={readingAnimation}
                                lottieRef={animation12Ref}
                            />
                            {isQuizVisible && (
                                <>
                                    <div className="card card-left mt-5 quiz-card position-relative">
                                        {/* Circular Progress Bar */}
                                        <div
                                            className="progress-circle position-absolute"
                                            style={{
                                                top: "-30px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                            }}
                                        >
                                            <svg viewBox="0 0 100 100" className="circular-chart blue">
                                                <defs>
                                                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" style={{ stopColor: "rgba(59, 32, 225, 0.39)" }} />
                                                        <stop offset="14%" style={{ stopColor: "#3B20E1" }} />
                                                        <stop offset="24%" style={{ stopColor: "#15057B" }} />
                                                        <stop offset="63%" style={{ stopColor: "#090232" }} />
                                                        <stop offset="100%" style={{ stopColor: "#000000" }} />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    className="circle-bg"
                                                    d="M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10"
                                                    fill="none"
                                                    stroke="#e6e6e6"
                                                    strokeWidth="10"
                                                />
                                                <path
                                                    className="circle"
                                                    strokeDasharray={strokeDasharray}
                                                    d="M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10"
                                                    fill="none"
                                                    stroke="url(#gradientStroke)"
                                                    strokeWidth="10"
                                                    strokeLinecap="round"
                                                />
                                                <text
                                                    x="50"
                                                    y="55"
                                                    className="percentage"
                                                    textAnchor="middle"
                                                    fontSize="20"
                                                >
                                                    {Math.round(percentage)}%
                                                </text>
                                            </svg>
                                        </div>
                                        <p className="mt-4">{Enrollquestions[currentQuestionIndex]}</p>
                                    </div>

                                    {/* Render Options Outside the Card */}
                                    <div className="d-flex flex-column align-items-center mt-4">
                                        {options.map((option) => (
                                            <div key={option} className="mb-2" style={{ width: "80%" }}>
                                                <button
                                                    type="button" // Ensure type is button
                                                    className={`btn w-100 quiz-button rounded-pill ${userAnswers[currentQuestionIndex] === option ? "selected" : ""}`}
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Ensure we prevent any default action
                                                        handleAnswer(option); // Call handleAnswer with the selected option
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            </div>
                                        ))}


                                        {/* Navigation Buttons */}
                                        <div className="d-flex justify-content-between mt-4" style={{ width: "80%" }}>
                                            {/* Previous Button */}
                                            {currentQuestionIndex > 0 && (
                                                <div>
                                                    <button type="button"
                                                        className="btn btn-secondary rounded-pill"
                                                        onClick={handlePrevious}
                                                    >
                                                        <i className="fas fa-angle-left"></i>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Next Button */}
                                            {showNextButton && currentQuestionIndex < Enrollquestions.length - 1 && (
                                                <div>
                                                    <button type="button"
                                                        className="btn btn-primary rounded-pill"
                                                        onClick={handleNext}
                                                    >
                                                        <i className="fas fa-angle-right"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    </div>
                )}
            </div>
        </div>

    )
};

export default HeartBot;