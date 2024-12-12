package com.easemob.ext_sdk.dispatch;

import android.util.Log;
import com.easemob.ext_sdk.common.ExtSdkCallback;
import com.easemob.ext_sdk.common.ExtSdkMethodType;
import com.hyphenate.EMCallBack;
import com.hyphenate.EMConversationListener;
import com.hyphenate.EMMessageListener;
import com.hyphenate.EMValueCallBack;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMCmdMessageBody;
import com.hyphenate.chat.EMCombineMessageBody;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMConversationFilter;
import com.hyphenate.chat.EMCursorResult;
import com.hyphenate.chat.EMCustomMessageBody;
import com.hyphenate.chat.EMFetchMessageOption;
import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMGroupReadAck;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMLanguage;
import com.hyphenate.chat.EMLocationMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.chat.EMMessagePinInfo;
import com.hyphenate.chat.EMMessageReaction;
import com.hyphenate.chat.EMMessageReactionChange;
import com.hyphenate.chat.EMNormalFileMessageBody;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.chat.EMVideoMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.hyphenate.exceptions.HyphenateException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ExtSdkChatManagerWrapper extends ExtSdkWrapper {

    public static class SingleHolder {
        static ExtSdkChatManagerWrapper instance = new ExtSdkChatManagerWrapper();
    }

    public static ExtSdkChatManagerWrapper getInstance() { return ExtSdkChatManagerWrapper.SingleHolder.instance; }

    ExtSdkChatManagerWrapper() { registerEaseListener(); }

    public void sendMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        final EMMessage msg = ExtSdkMessageHelper.fromJson(param);
        msg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {
                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(msg));
                map.put("localTime", msg.localTime());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", msg.localTime());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(msg));
                map.put("localTime", msg.localTime());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });

        EMClient.getInstance().chatManager().sendMessage(msg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(msg));
    }

    public void resendMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMMessage tempMsg = ExtSdkMessageHelper.fromJson(param);
        tempMsg.setStatus(EMMessage.Status.CREATE);
        EMMessage finalMsg = tempMsg;
        finalMsg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", finalMsg.localTime());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });
        EMClient.getInstance().chatManager().sendMessage(finalMsg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(finalMsg));
    }

    public void ackMessageRead(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msg_id");
        String to = param.getString("to");

        try {
            EMClient.getInstance().chatManager().ackMessageRead(to, msgId);
            onSuccess(result, channelName, true);
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void ackGroupMessageRead(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msg_id");
        String to = param.getString("group_id");
        String content = null;
        if (param.has("content")) {
            content = param.getString("content");
        }
        String finalContent = content;

        try {
            EMClient.getInstance().chatManager().ackGroupMessageRead(to, msgId, finalContent);
            onSuccess(result, channelName, null);
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void ackConversationRead(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String conversationId = param.getString("convId");

        try {
            EMClient.getInstance().chatManager().ackConversationRead(conversationId);
            onSuccess(result, channelName, true);
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void recallMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msg_id");

        try {
            EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
            if (ExtSdkWrapper.checkMessageParams(msg, channelName, result)) {
                return;
            }
            EMClient.getInstance().chatManager().recallMessage(msg);
            onSuccess(result, channelName, null);
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void getMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msg_id");

        EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
        if (ExtSdkWrapper.getMessageParams(msg, channelName, result)) {
            return;
        }
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(msg));
    }

    public void getConversation(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMConversation conversation = this.getConversation(param);
        onSuccess(result, channelName, ExtSdkConversationHelper.toJson(conversation));
    }

    public void markAllChatMsgAsRead(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMClient.getInstance().chatManager().markAllConversationsAsRead();

        onSuccess(result, channelName, null);
    }

    public void getUnreadMessageCount(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        int count = EMClient.getInstance().chatManager().getUnreadMessageCount();

        onSuccess(result, channelName, count);
    }

    public void updateChatMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMMessage msg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        EMMessage dbMsg =
            EMClient.getInstance().chatManager().getMessage(param.getJSONObject("message").getString("msgId"));
        if (ExtSdkWrapper.checkMessageParams(dbMsg, channelName, result)) {
            return;
        }
        this.mergeMessage(msg, dbMsg);

        boolean ret = EMClient.getInstance().chatManager().updateMessage(dbMsg);
        if (ret) {
            onSuccess(result, channelName, ExtSdkMessageHelper.toJson(dbMsg));
        } else {
            onError(result, 1, "Failed to update the message.");
        }
    }

    public void importMessages(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        JSONArray ary = param.getJSONArray("messages");
        List<EMMessage> messages = new ArrayList<>();
        for (int i = 0; i < ary.length(); i++) {
            JSONObject obj = ary.getJSONObject(i);
            messages.add(ExtSdkMessageHelper.fromJson(obj));
        }

        EMClient.getInstance().chatManager().importMessages(messages);
        onSuccess(result, channelName, null);
    }

    public void downloadAttachmentInCombine(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        final EMMessage finalMsg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        finalMsg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });

        EMClient.getInstance().chatManager().downloadAttachment(finalMsg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(finalMsg));
    }

    public void downloadThumbnailInCombine(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        final EMMessage finalMsg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        finalMsg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });

        EMClient.getInstance().chatManager().downloadThumbnail(finalMsg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(finalMsg));
    }

    public void downloadAttachment(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMMessage tempMsg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        EMMessage msg = EMClient.getInstance().chatManager().getMessage(tempMsg.getMsgId());
        if (ExtSdkWrapper.checkMessageParams(msg, channelName, result)) {
            return;
        }
        EMMessage finalMsg = msg;
        msg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });

        EMClient.getInstance().chatManager().downloadAttachment(msg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(msg));
    }

    public void downloadThumbnail(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMMessage tempMsg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        EMMessage msg = EMClient.getInstance().chatManager().getMessage(tempMsg.getMsgId());
        if (ExtSdkWrapper.checkMessageParams(msg, channelName, result)) {
            return;
        }
        if (null == msg) {
            msg = tempMsg;
        }
        EMMessage finalMsg = msg;
        msg.setMessageStatusCallback(new EMCallBack() {
            @Override
            public void onSuccess() {

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageSuccess);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onProgress(int progress, String status) {

                Map<String, Object> map = new HashMap<>();
                map.put("progress", progress);
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("callbackType", ExtSdkMethodType.onMessageProgressUpdate);
                ExtSdkWrapper.onReceive(channelName, map);
            }

            @Override
            public void onError(int code, String desc) {
                Map<String, Object> data = new HashMap<>();
                data.put("code", code);
                data.put("description", desc);

                Map<String, Object> map = new HashMap<>();
                map.put("message", ExtSdkMessageHelper.toJson(finalMsg));
                map.put("localTime", finalMsg.localTime());
                map.put("msgId", finalMsg.getMsgId());
                map.put("error", data);
                map.put("callbackType", ExtSdkMethodType.onMessageError);
                ExtSdkWrapper.onReceive(channelName, map);
            }
        });

        EMClient.getInstance().chatManager().downloadThumbnail(msg);
        onSuccess(result, channelName, ExtSdkMessageHelper.toJson(msg));
    }

    public void loadAllConversations(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {

        List<EMConversation> list = EMClient.getInstance().chatManager().getAllConversationsBySort();
        List<Map> conversations = new ArrayList<>();
        for (EMConversation conversation : list) {
            conversations.add(ExtSdkConversationHelper.toJson(conversation));
        }
        onSuccess(result, channelName, conversations);
    }

    public void getConversationsFromServer(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {

        try {
            List<EMConversation> list =
                new ArrayList<>(EMClient.getInstance().chatManager().fetchConversationsFromServer().values());
            Collections.sort(
                list, (o1, o2) -> (o2.getLastMessage().getMsgTime() - o1.getLastMessage().getMsgTime() > 0 ? 1 : -1));
            List<Map> conversations = new ArrayList<>();
            for (EMConversation conversation : list) {
                conversations.add(ExtSdkConversationHelper.toJson(conversation));
            }
            onSuccess(result, channelName, conversations);
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void deleteConversation(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String conId = param.getString("convId");
        boolean isDelete = param.getBoolean("deleteMessages");

        boolean ret = EMClient.getInstance().chatManager().deleteConversation(conId, isDelete);
        if (ret) {
            onSuccess(result, channelName, null);
        } else {
            onError(result, 1, "remove conversation is failed.");
        }
    }

    public void fetchHistoryMessages(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String conId = param.getString("convId");
        EMConversation.EMConversationType type = ExtSdkConversationHelper.typeFromInt(param.getInt("convType"));
        int pageSize = param.getInt("pageSize");
        String startMsgId = param.getString("startMsgId");
        int direction = param.getInt("direction");

        try {
            EMCursorResult<EMMessage> cursorResult = EMClient.getInstance().chatManager().fetchHistoryMessages(
                conId, type, pageSize, startMsgId,
                direction == 0 ? EMConversation.EMSearchDirection.UP : EMConversation.EMSearchDirection.DOWN);
            onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(cursorResult));
        } catch (HyphenateException e) {
            onError(result, e, null);
        }
    }

    public void fetchHistoryMessagesByOptions(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        String convId = param.getString("convId");
        EMConversation.EMConversationType type = ExtSdkConversationHelper.typeFromInt(param.getInt("convType"));
        String cursor = "";
        int pageSize = 20;
        EMFetchMessageOption option = new EMFetchMessageOption();
        cursor = param.getString("cursor");
        pageSize = param.getInt("pageSize");
        if (param.has("options")) {
            option = ExtSdkFetchMessageOptionHelper.fromJson(param.getJSONObject("options"));
        }

        EMClient.getInstance().chatManager().asyncFetchHistoryMessages(
            convId, type, pageSize, cursor, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
                @Override
                public void onSuccess(EMCursorResult<EMMessage> value) {
                    ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(value));
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    public void searchChatMsgFromDB(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String keywords = param.getString("keywords");
        long timeStamp = param.getLong("timeStamp");
        int count = param.getInt("maxCount");
        String from = param.getString("from");
        EMConversation.EMSearchDirection direction = searchDirectionFromString(param.getString("direction"));
        EMConversation.EMMessageSearchScope scope;
        if (param.has("searchScope")) {
            scope = EMConversation.EMMessageSearchScope.values()[param.getInt("searchScope")];
        } else {
            scope = EMConversation.EMMessageSearchScope.ALL;
        }

        List<EMMessage> msgList =
            EMClient.getInstance().chatManager().searchMsgFromDB(keywords, timeStamp, count, from, direction, scope);
        List<Map> messages = new ArrayList<>();
        for (EMMessage msg : msgList) {
            messages.add(ExtSdkMessageHelper.toJson(msg));
        }
        onSuccess(result, channelName, messages);
    }

    public void asyncFetchGroupAcks(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msg_id");
        String ackId = param.getString("ack_id");
        int pageSize = param.getInt("pageSize");
        EMClient.getInstance().chatManager().asyncFetchGroupReadAcks(
            msgId, pageSize, ackId, new EMValueCallBack<EMCursorResult<EMGroupReadAck>>() {
                @Override
                public void onSuccess(EMCursorResult<EMGroupReadAck> value) {
                    ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(value));
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    public void deleteRemoteConversation(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        String conversationId = param.getString("conversationId");
        EMConversation.EMConversationType type = typeFromInt(param.getInt("conversationType"));
        boolean isDeleteRemoteMessage = param.getBoolean("isDeleteRemoteMessage");
        EMClient.getInstance().chatManager().deleteConversationFromServer(
            conversationId, type, isDeleteRemoteMessage, new EMCallBack() {
                @Override
                public void onSuccess() {
                    ExtSdkWrapper.onSuccess(result, channelName, null);
                }

                @Override
                public void onError(int code, String error) {
                    ExtSdkWrapper.onError(result, error, error);
                }

                @Override
                public void onProgress(int progress, String status) {}
            });
    }

    public void deleteMessagesBeforeTimestamp(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        long timestamp = param.getLong("timestamp");
        EMClient.getInstance().chatManager().deleteMessagesBeforeTimestamp(timestamp, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, error, error);
            }
        });
    }

    private EMConversation.EMConversationType typeFromInt(int conversationType) {
        EMConversation.EMConversationType ret = EMConversation.EMConversationType.Chat;
        switch (conversationType) {
        case 0:
            ret = EMConversation.EMConversationType.Chat;
            break;
        case 1:
            ret = EMConversation.EMConversationType.GroupChat;
            break;
        case 2:
            ret = EMConversation.EMConversationType.ChatRoom;
            break;
        }
        return ret;
    }

    public void translateMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        EMMessage msg = ExtSdkMessageHelper.fromJson(param.getJSONObject("message"));
        List<String> list = new ArrayList<String>();
        if (param.has("languages")) {
            JSONArray array = param.getJSONArray("languages");
            for (int i = 0; i < array.length(); i++) {
                list.add(array.getString(i));
            }
        }

        EMMessage dbMsg = EMClient.getInstance().chatManager().getMessage(msg.getMsgId());
        if (ExtSdkWrapper.checkMessageParams(dbMsg, channelName, result)) {
            return;
        }
        EMClient.getInstance().chatManager().translateMessage(dbMsg, list, new EMValueCallBack<EMMessage>() {
            @Override
            public void onSuccess(EMMessage value) {
                Map<String, Object> data = new HashMap<>();
                data.put("message", ExtSdkMessageHelper.toJson(value));
                ExtSdkWrapper.onSuccess(result, channelName, data);
            }

            @Override
            public void onError(int error, String errorMsg) {
                ExtSdkWrapper.onError(result, error, errorMsg);
            }
        });
    }

    public void fetchSupportedLanguages(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        EMClient.getInstance().chatManager().fetchSupportLanguages(new EMValueCallBack<List<EMLanguage>>() {
            @Override
            public void onSuccess(List<EMLanguage> value) {
                List<Map> list = new ArrayList<>();
                for (EMLanguage language : value) {
                    list.add(ExtSdkLanguageHelper.toJson(language));
                }
                ExtSdkWrapper.onSuccess(result, channelName, list);
            }

            @Override
            public void onError(int error, String errorMsg) {
                ExtSdkWrapper.onError(result, error, errorMsg);
            }
        });
    }

    public void addReaction(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String reaction = param.getString("reaction");
        String msgId = param.getString("msgId");
        EMClient.getInstance().chatManager().asyncAddReaction(msgId, reaction, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void removeReaction(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String reaction = param.getString("reaction");
        String msgId = param.getString("msgId");
        EMClient.getInstance().chatManager().asyncRemoveReaction(msgId, reaction, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void fetchReactionList(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        List<String> msgIds = new ArrayList<>();
        JSONArray ja = param.getJSONArray("msgIds");
        for (int i = 0; i < ja.length(); i++) {
            msgIds.add(ja.getString(i));
        }
        String groupId = null;
        if (param.has("groupId")) {
            groupId = param.getString("groupId");
        }
        EMMessage.ChatType type = EMMessage.ChatType.Chat;
        int iType = param.getInt("chatType");
        if (iType == 0) {
            type = EMMessage.ChatType.Chat;
        } else if (iType == 1) {
            type = EMMessage.ChatType.GroupChat;
        } else {
            type = EMMessage.ChatType.ChatRoom;
        }
        EMClient.getInstance().chatManager().asyncGetReactionList(
            msgIds, type, groupId, new EMValueCallBack<Map<String, List<EMMessageReaction>>>() {
                @Override
                public void onSuccess(Map<String, List<EMMessageReaction>> value) {
                    HashMap<String, List<Map<String, Object>>> map = new HashMap<>();
                    if (value != null) {
                        for (Map.Entry<String, List<EMMessageReaction>> entry : value.entrySet()) {
                            List<EMMessageReaction> list = entry.getValue();
                            ArrayList<Map<String, Object>> ary = new ArrayList<>();
                            for (int i = 0; i < list.size(); i++) {
                                ary.add(ExtSdkMessageReactionHelper.toJson(list.get(i)));
                            }
                            map.put(entry.getKey(), ary);
                        }
                    }
                    ExtSdkWrapper.onSuccess(result, channelName, map);
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    public void fetchReactionDetail(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msgId");
        String reaction = param.getString("reaction");
        String cursor = null;
        if (param.has("cursor")) {
            cursor = param.getString("cursor");
        }
        int pageSize = 50;
        if (param.has("pageSize")) {
            pageSize = param.getInt("pageSize");
        }
        EMClient.getInstance().chatManager().asyncGetReactionDetail(
            msgId, reaction, cursor, pageSize, new EMValueCallBack<EMCursorResult<EMMessageReaction>>() {
                @Override
                public void onSuccess(EMCursorResult<EMMessageReaction> value) {
                    ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(value));
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    public void reportMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msgId");
        String tag = param.getString("tag");
        String reason = param.getString("reason");
        EMClient.getInstance().chatManager().asyncReportMessage(msgId, tag, reason, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void fetchConversationsFromServerWithPage(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        int pageNum = param.getInt("pageNum");
        int pageSize = param.getInt("pageSize");
        EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(
            pageNum, pageSize, new EMValueCallBack<Map<String, EMConversation>>() {
                @Override
                public void onSuccess(Map<String, EMConversation> value) {
                    ArrayList<EMConversation> list = new ArrayList<>(value.values());
                    boolean retry = false;
                    List<Map> conversations = new ArrayList<>();
                    do {
                        try {
                            retry = false;
                            Collections.sort(list, new Comparator<EMConversation>() {
                                @Override
                                public int compare(EMConversation o1, EMConversation o2) {
                                    if (o1 == null && o2 == null) {
                                        return 0;
                                    }
                                    if (o1.getLastMessage() == null) {
                                        return 1;
                                    }

                                    if (o2.getLastMessage() == null) {
                                        return -1;
                                    }

                                    if (o1.getLastMessage().getMsgTime() == o2.getLastMessage().getMsgTime()) {
                                        return 0;
                                    }

                                    return o2.getLastMessage().getMsgTime() - o1.getLastMessage().getMsgTime() > 0 ? 1
                                                                                                                   : -1;
                                }
                            });
                            for (EMConversation conversation : list) {
                                conversations.add(ExtSdkConversationHelper.toJson(conversation));
                            }

                        } catch (IllegalArgumentException e) {
                            retry = true;
                        }
                    } while (retry);
                    ExtSdkWrapper.onSuccess(result, channelName, conversations);
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    public void removeMessagesFromServerWithMsgIds(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        EMConversation conversation = this.getConversation(param);

        JSONArray jsonArray = param.getJSONArray("msgIds");

        ArrayList<String> msgIds = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            msgIds.add((String)jsonArray.get(i));
        }

        conversation.removeMessagesFromServer(msgIds, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void removeMessagesFromServerWithTs(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        EMConversation conversation = this.getConversation(param);
        long timestamp = param.getLong("timestamp");
        conversation.removeMessagesFromServer(timestamp, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void getConversationsFromServerWithCursor(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        String cursor = param.optString("cursor");
        int pageSize = param.optInt("pageSize");
        EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(
            pageSize, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
                @Override
                public void onSuccess(EMCursorResult<EMConversation> emConversationEMCursorResult) {
                    ExtSdkWrapper.onSuccess(result, channelName,
                                            ExtSdkCursorResultHelper.toJson(emConversationEMCursorResult));
                }

                @Override
                public void onError(int i, String s) {
                    ExtSdkWrapper.onError(result, i, s);
                }
            });
    }

    public void getPinnedConversationsFromServerWithCursor(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        String cursor = param.optString("cursor");
        int pageSize = param.optInt("pageSize");
        EMClient.getInstance().chatManager().asyncFetchPinnedConversationsFromServer(
            pageSize, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
                @Override
                public void onSuccess(EMCursorResult<EMConversation> emConversationEMCursorResult) {
                    ExtSdkWrapper.onSuccess(result, channelName,
                                            ExtSdkCursorResultHelper.toJson(emConversationEMCursorResult));
                }

                @Override
                public void onError(int i, String s) {
                    ExtSdkWrapper.onError(result, i, s);
                }
            });
    }

    public void pinConversation(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String convId = param.optString("convId");
        Boolean isPinned = param.optBoolean("isPinned", false);
        EMClient.getInstance().chatManager().asyncPinConversation(convId, isPinned, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int i, String s) {
                ExtSdkWrapper.onError(result, i, s);
            }
        });
    }

    public void modifyMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.optString("msgId");
        EMMessageBody body = ExtSdkMessageBodyHelper.textBodyFromJson(param.optJSONObject("body"));
        EMClient.getInstance().chatManager().asyncModifyMessage(msgId, body, new EMValueCallBack<EMMessage>() {
            @Override
            public void onSuccess(EMMessage emMessage) {
                ExtSdkWrapper.onSuccess(result, channelName, ExtSdkMessageHelper.toJson(emMessage));
            }

            @Override
            public void onError(int i, String s) {
                ExtSdkWrapper.onError(result, i, s);
            }
        });
    }

    public void downloadAndParseCombineMessage(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        EMMessage msg = ExtSdkMessageHelper.fromJson(param.optJSONObject("message"));
        EMClient.getInstance().chatManager().downloadAndParseCombineMessage(
            msg, new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> emMessages) {
                    List<Map> messages = new ArrayList<>();
                    for (EMMessage msg : emMessages) {
                        messages.add(ExtSdkMessageHelper.toJson(msg));
                    }
                    ExtSdkWrapper.onSuccess(result, channelName, messages);
                }

                @Override
                public void onError(int i, String s) {
                    ExtSdkWrapper.onError(result, i, s);
                }
            });
    }

    public void addRemoteAndLocalConversationsMark(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        JSONArray jsonArray = param.getJSONArray("convIds");
        ArrayList<String> convIds = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            convIds.add((String)jsonArray.get(i));
        }
        EMConversation.EMMarkType mark = EMConversation.EMMarkType.values()[param.getInt("mark")];
        EMClient.getInstance().chatManager().asyncAddConversationMark(convIds, mark, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void deleteRemoteAndLocalConversationsMark(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        JSONArray jsonArray = param.getJSONArray("convIds");
        ArrayList<String> convIds = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            convIds.add((String)jsonArray.get(i));
        }
        EMConversation.EMMarkType mark = EMConversation.EMMarkType.values()[param.getInt("mark")];
        EMClient.getInstance().chatManager().asyncRemoveConversationMark(convIds, mark, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void fetchConversationsByOptions(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        String cursor = ExtSdkConversationFilterHelper.cursor(param);
        Boolean isPinned = ExtSdkConversationFilterHelper.pinned(param);
        Boolean isMark = ExtSdkConversationFilterHelper.hasMark(param);
        int pageSize = ExtSdkConversationFilterHelper.pageSize(param);
        if (isPinned) {
            EMClient.getInstance().chatManager().asyncFetchPinnedConversationsFromServer(
                pageSize, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
                    @Override
                    public void onSuccess(EMCursorResult<EMConversation> emCursorResult) {
                        ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(emCursorResult));
                    }

                    @Override
                    public void onError(int i, String s) {
                        ExtSdkWrapper.onError(result, i, s);
                    }
                });
            return;
        }

        if (isMark) {
            EMConversationFilter filter = ExtSdkConversationFilterHelper.fromJson(param);
            EMClient.getInstance().chatManager().asyncGetConversationsFromServerWithCursor(
                cursor, filter, new EMValueCallBack<EMCursorResult<EMConversation>>() {
                    @Override
                    public void onSuccess(EMCursorResult<EMConversation> value) {
                        ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(value));
                    }

                    @Override
                    public void onError(int error, String errorMsg) {
                        ExtSdkWrapper.onError(result, error, errorMsg);
                    }
                });
            return;
        }

        EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(
            pageSize, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
                @Override
                public void onSuccess(EMCursorResult<EMConversation> emCursorResult) {
                    ExtSdkWrapper.onSuccess(result, channelName, ExtSdkCursorResultHelper.toJson(emCursorResult));
                }

                @Override
                public void onError(int i, String s) {
                    ExtSdkWrapper.onError(result, i, s);
                }
            });
    }

    public void deleteAllMessageAndConversation(JSONObject param, String channelName, ExtSdkCallback result)
        throws JSONException {
        Boolean clearServerData = param.getBoolean("clearServerData");
        EMClient.getInstance().chatManager().asyncDeleteAllMsgsAndConversations(clearServerData, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void pinMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msgId");
        EMClient.getInstance().chatManager().asyncPinMessage(msgId, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void unpinMessage(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String msgId = param.getString("msgId");
        EMClient.getInstance().chatManager().asyncUnPinMessage(msgId, new EMCallBack() {
            @Override
            public void onSuccess() {
                ExtSdkWrapper.onSuccess(result, channelName, null);
            }

            @Override
            public void onError(int code, String error) {
                ExtSdkWrapper.onError(result, code, error);
            }
        });
    }

    public void fetchPinnedMessages(JSONObject param, String channelName, ExtSdkCallback result) throws JSONException {
        String convId = param.getString("convId");
        EMClient.getInstance().chatManager().asyncGetPinnedMessagesFromServer(
            convId, new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> value) {
                    List<Map> messages = new ArrayList<>();
                    for (EMMessage msg : value) {
                        messages.add(ExtSdkMessageHelper.toJson(msg));
                    }
                    ExtSdkWrapper.onSuccess(result, channelName, messages);
                }

                @Override
                public void onError(int error, String errorMsg) {
                    ExtSdkWrapper.onError(result, error, errorMsg);
                }
            });
    }

    private void registerEaseListener() {
        if (this.messageListener != null) {
            EMClient.getInstance().chatManager().removeMessageListener(this.messageListener);
        }
        this.messageListener = new EMMessageListener() {
            @Override
            public void onMessageReceived(List<EMMessage> messages) {
                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMMessage message : messages) {
                    msgList.add(ExtSdkMessageHelper.toJson(message));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessagesReceived, msgList);
            }

            @Override
            public void onCmdMessageReceived(List<EMMessage> messages) {

                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMMessage message : messages) {
                    msgList.add(ExtSdkMessageHelper.toJson(message));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onCmdMessagesReceived, msgList);
            }

            @Override
            public void onMessageRead(List<EMMessage> messages) {
                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMMessage message : messages) {
                    msgList.add(ExtSdkMessageHelper.toJson(message));
                    ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessageReadAck, ExtSdkMessageHelper.toJson(message));
                }

                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessagesRead, msgList);
            }

            @Override
            public void onMessageDelivered(List<EMMessage> messages) {
                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMMessage message : messages) {
                    msgList.add(ExtSdkMessageHelper.toJson(message));
                    ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessageDeliveryAck, ExtSdkMessageHelper.toJson(message));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessagesDelivered, msgList);
            }

            @Override
            public void onMessageRecalled(List<EMMessage> messages) {
                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMMessage message : messages) {
                    msgList.add(ExtSdkMessageHelper.toJson(message));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessagesRecalled, msgList);
            }

            @Override
            public void onGroupMessageRead(List<EMGroupReadAck> var1) {
                ArrayList<Map<String, Object>> msgList = new ArrayList<>();
                for (EMGroupReadAck ack : var1) {
                    msgList.add(ExtSdkGroupAckHelper.toJson(ack));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onGroupMessageRead, msgList);
            }

            @Override
            public void onReadAckForGroupMessageUpdated() {
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onReadAckForGroupMessageUpdated, null);
            }

            @Override
            public void onReactionChanged(List<EMMessageReactionChange> messageReactionChangeList) {
                ArrayList<Map<String, Object>> list = new ArrayList<>();
                for (EMMessageReactionChange change : messageReactionChangeList) {
                    list.add(ExtSdkMessageReactionChangeHelper.toJson(change));
                }
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessageReactionDidChange, list);
            }

            @Override
            public void onMessageContentChanged(EMMessage messageModified, String operatorId, long operationTime) {
                Map msgMap = ExtSdkMessageHelper.toJson(messageModified);
                Map ret = new HashMap<>();
                ret.put("message", msgMap);
                ret.put("lastModifyOperatorId", operatorId);
                ret.put("lastModifyTime", operationTime);
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessageContentChanged, ret);
            }

            @Override
            public void onMessagePinChanged(String messageId, String conversationId,
                                            EMMessagePinInfo.PinOperation pinOperation, EMMessagePinInfo pinInfo) {
                Map map = new HashMap<>();
                map.put("messageId", messageId);
                map.put("conversationId", conversationId);
                map.put("pinOperation", pinOperation.ordinal());
                map.put("pinInfo", ExtSdkMessagePinInfoHelper.toJson(pinInfo));
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onMessagePinChanged, map);
            }
        };
        EMClient.getInstance().chatManager().addMessageListener(this.messageListener);

        if (this.conversationListener != null) {
            EMClient.getInstance().chatManager().removeConversationListener(this.conversationListener);
        }
        this.conversationListener = new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                Map<String, Object> data = new HashMap<>();
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onConversationUpdate, data);
            }

            @Override
            public void onConversationRead(String from, String to) {
                Map<String, Object> data = new HashMap<>();
                data.put("from", from);
                data.put("to", to);
                ExtSdkWrapper.onReceive(ExtSdkMethodType.onConversationHasRead, data);
            }
        };
        EMClient.getInstance().chatManager().addConversationListener(this.conversationListener);
    }

    private EMConversation.EMSearchDirection searchDirectionFromString(String direction) {
        return direction.equals("up") ? EMConversation.EMSearchDirection.UP : EMConversation.EMSearchDirection.DOWN;
    }

    private EMMessageListener messageListener = null;
    private EMConversationListener conversationListener = null;
}
