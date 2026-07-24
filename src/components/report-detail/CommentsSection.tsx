import { useState, type FormEvent, type ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { fetchComments, createComment, deleteComment } from "../../lib/commentsApi";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentsSectionProps {
  reportType: "lost_report" | "sighting_report";
  reportId: string;
}

export const CommentsSection = ({ reportType, reportId }: CommentsSectionProps): ReactElement => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const commentsQuery = useQuery({
    queryKey: ["comments", reportType, reportId],
    queryFn: () => fetchComments(reportType, reportId),
  });

  const createMutation = useMutation({
    mutationFn: () => createComment({ report_type: reportType, report_id: reportId, comment: text }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["comments", reportType, reportId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reportType, reportId] });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!text.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <h2 className="text-lg font-semibold">Comments</h2>

      {session && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
          />
          <Button type="submit" size="sm" disabled={createMutation.isPending || !text.trim()}>
            {createMutation.isPending ? "Posting..." : "Post comment"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {commentsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        )}

        {commentsQuery.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}

        {commentsQuery.data?.map((comment) => (
          <div key={comment.id} className="flex gap-3 text-sm">
            {comment.Profile.profile_photo ? (
              <img
                src={comment.Profile.profile_photo}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <Icon icon="mdi:account-circle" className="h-8 w-8 shrink-0 text-muted-foreground" />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{comment.Profile.full_name}</p>
                {session?.user.id === comment.user_id && (
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    className="text-xs text-muted-foreground hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-muted-foreground">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};